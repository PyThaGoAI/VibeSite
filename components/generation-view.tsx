"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { debounce } from "lodash"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Copy, 
  Download, 
  RefreshCw, 
  Loader2, 
  Save, 
  ArrowRight,
  Code2,
  Eye,
  Sparkles,
  Zap,
  Settings,
  Home,
  Maximize2,
  Minimize2
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { ThinkingIndicator } from "@/components/thinking-indicator"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CodeEditor } from "@/components/code-editor"
import { WorkSteps } from "@/components/work-steps"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

interface GenerationViewProps {
  prompt: string
  setPrompt: (value: string) => void
  model: string
  provider?: string
  generatedCode: string
  isGenerating: boolean
  generationComplete: boolean
  onRegenerateWithNewPrompt: (newPrompt: string) => void
  thinkingOutput?: string
  isThinking?: boolean
}

export function GenerationView({
  prompt,
  setPrompt,
  model,
  provider = 'deepseek',
  generatedCode,
  isGenerating,
  generationComplete,
  onRegenerateWithNewPrompt,
  thinkingOutput = "",
  isThinking = false
}: GenerationViewProps) {
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview")
  const [isEditable, setIsEditable] = useState(false)
  const [editedCode, setEditedCode] = useState(generatedCode)
  const [originalCode, setOriginalCode] = useState(generatedCode)
  const [hasChanges, setHasChanges] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [previewContent, setPreviewContent] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newPrompt, setNewPrompt] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const prevContentRef = useRef<string>("")

  const prepareHtmlContent = (code: string): string => {
    const darkModeStyle = `
      <style>
        :root {
          color-scheme: dark;
        }
        html, body {
          background-color: #020202;
          color: #ffffff;
          min-height: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        body {
          margin: 0;
          padding: 0;
          transition: background-color 0.2s ease;
        }
      </style>
    `;

    let result = "";
    if (code.includes('<head>')) {
      result = code.replace('<head>', `<head>${darkModeStyle}`);
    } else if (code.includes('<html>')) {
      result = code.replace('<html>', `<html><head>${darkModeStyle}</head>`);
    } else {
      result = `
        <!DOCTYPE html>
        <html>
          <head>
            ${darkModeStyle}
          </head>
          <body>
            ${code}
          </body>
        </html>
      `;
    }
    return result;
  };

  const debouncedUpdatePreview = useCallback(
    debounce((code: string) => {
      const preparedHtml = prepareHtmlContent(code);
      prevContentRef.current = preparedHtml;
      setPreviewContent(preparedHtml);
    }, 50),
    []
  );

  useEffect(() => {
    setEditedCode(generatedCode)
    setOriginalCode(generatedCode)
    setHasChanges(false)

    if (generatedCode) {
      debouncedUpdatePreview(generatedCode);
    }
  }, [generatedCode, debouncedUpdatePreview])

  useEffect(() => {
    if (editedCode !== originalCode) {
      setHasChanges(true)
    } else {
      setHasChanges(false)
    }

    if (editedCode) {
      debouncedUpdatePreview(editedCode);
    }
  }, [editedCode, originalCode, debouncedUpdatePreview])

  const saveChanges = () => {
    setOriginalCode(editedCode)
    setHasChanges(false)
  }

  const copyToClipboard = () => {
    const currentCode = isEditable ? editedCode : originalCode
    navigator.clipboard.writeText(currentCode)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch(err => {
        console.error('Error copying:', err)
      })
  }

  const refreshPreview = () => {
    const currentCode = isEditable ? editedCode : originalCode;
    debouncedUpdatePreview.flush();
    const preparedHtml = prepareHtmlContent(currentCode);
    setPreviewContent(preparedHtml);
    setPreviewKey(prevKey => prevKey + 1);
  }

  const downloadCode = () => {
    const currentCode = isEditable ? editedCode : originalCode
    const element = document.createElement("a")
    const file = new Blob([currentCode], {type: 'text/html'})
    element.href = URL.createObjectURL(file)
    element.download = "generated-website.html"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSendNewPrompt = () => {
    if (!newPrompt.trim() || isGenerating) return
    onRegenerateWithNewPrompt(newPrompt)
    setNewPrompt("")
  }

  const getProviderInfo = () => {
    const providers = {
      'deepseek': { name: 'DEEPSEEK', color: 'from-blue-500 to-cyan-500' },
      'openai_compatible': { name: 'CUSTOM API', color: 'from-green-500 to-emerald-500' },
      'ollama': { name: 'OLLAMA', color: 'from-orange-500 to-red-500' },
      'lm_studio': { name: 'LM STUDIO', color: 'from-purple-500 to-pink-500' }
    }
    return providers[provider as keyof typeof providers] || { name: 'AI', color: 'from-gray-500 to-gray-600' }
  }

  const providerInfo = getProviderInfo()

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Premium Header */}
      <header className="w-full glass-strong border-b border-purple-500/20 p-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${providerInfo.color} flex items-center justify-center flex-shrink-0`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-base sm:text-lg font-bold text-white truncate">PythaGO AI</h1>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-xs">
                  {model}
                </Badge>
                {thinkingOutput && (
                  <ThinkingIndicator
                    thinkingOutput={thinkingOutput}
                    isThinking={isThinking}
                    position="top-left"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Code Generation in Progress</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-purple-500/10 text-purple-300"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              disabled={isGenerating}
              className="h-8 sm:h-9 px-2 sm:px-3 hover:bg-purple-500/10 text-purple-300"
            >
              <Home className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline text-xs sm:text-sm">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadCode}
              disabled={!generatedCode || isGenerating}
              className="h-8 sm:h-9 px-2 sm:px-3 hover:bg-purple-500/10 text-purple-300"
            >
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline text-xs sm:text-sm">Export</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden w-full flex glass border-b border-purple-500/20">
        <button
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === "code" 
              ? "text-purple-300 border-b-2 border-purple-500 bg-purple-500/10" 
              : "text-muted-foreground hover:text-purple-300"
          }`}
          onClick={() => setActiveTab("code")}
        >
          <Code2 className="w-4 h-4 mx-auto mb-1" />
          CODE
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === "preview" 
              ? "text-purple-300 border-b-2 border-purple-500 bg-purple-500/10" 
              : "text-muted-foreground hover:text-purple-300"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          <Eye className="w-4 h-4 mx-auto mb-1" />
          PREVIEW
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden w-full flex flex-col">
          {activeTab === "code" ? (
            <>
              {/* Code Editor */}
              <div className="h-[60%] w-full border-b border-purple-500/20 flex flex-col">
                <div className="flex items-center justify-between p-3 glass border-b border-purple-500/20">
                  <div className="flex items-center space-x-3">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">Generated Code</span>
                    {generationComplete && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {isEditable ? 'Edit Mode' : 'Read Only'}
                        </span>
                        <Switch
                          checked={isEditable}
                          onCheckedChange={(checked) => {
                            if (!checked && hasChanges) {
                              setShowSaveDialog(true);
                            } else {
                              setIsEditable(checked);
                            }
                          }}
                          disabled={isGenerating}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditable && hasChanges && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={saveChanges}
                        className="h-8 px-3 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!generatedCode || isGenerating}
                      className="h-8 px-3 text-purple-300 hover:text-purple-200"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copySuccess ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 w-full overflow-hidden">
                  {isGenerating && !generatedCode ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto pulse-glow">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                        <p className="text-purple-300 font-medium">Generating code...</p>
                        <p className="text-xs text-muted-foreground mt-1">This may take a few moments</p>
                      </div>
                    </div>
                  ) : (
                    <CodeEditor
                      code={isEditable ? editedCode : originalCode}
                      isEditable={isEditable && generationComplete}
                      onChange={(newCode) => setEditedCode(newCode)}
                    />
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="h-[40%] w-full p-4 flex flex-col overflow-hidden">
                <div className="mb-4 flex-shrink-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">New Prompt</span>
                  </div>
                  <div className="relative">
                    <Textarea
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      placeholder="Describe changes or new features..."
                      className="input-premium min-h-[60px] pr-12 resize-none w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendNewPrompt()
                        }
                      }}
                      disabled={isGenerating}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendNewPrompt}
                      disabled={!newPrompt.trim() || isGenerating}
                      className={`absolute bottom-2 right-2 h-8 w-8 p-0 ${
                        newPrompt.trim() 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <ArrowRight className={`h-3 w-3 ${newPrompt.trim() ? 'text-white' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                  {prompt && (
                    <div className="mt-3">
                      <span className="text-xs font-medium text-muted-foreground">Previous:</span>
                      <ScrollArea className="h-10 w-full rounded-lg glass border border-purple-500/20 p-2 mt-1">
                        <p className="text-xs text-muted-foreground">{prompt}</p>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-purple-300">AI Work Steps</span>
                  </div>
                  <div className="h-[calc(100%-24px)] overflow-hidden">
                    <WorkSteps
                      isGenerating={isGenerating}
                      generationComplete={generationComplete}
                      generatedCode={isEditable ? editedCode : generatedCode}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Preview for Mobile */
            <>
              <div className="p-3 glass border-b border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">Live Preview</span>
                </div>
                <div className="flex items-center space-x-1">
                  {generationComplete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshPreview}
                      className="h-8 px-2 text-purple-300 hover:text-purple-200"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      <span className="text-xs">Refresh</span>
                    </Button>
                  )}
                  <Button
                    variant={viewportSize === "desktop" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize("desktop")}
                    className="h-8 w-8 p-0"
                  >
                    <Laptop className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={viewportSize === "tablet" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize("tablet")}
                    className="h-8 w-8 p-0"
                  >
                    <Tablet className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={viewportSize === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize("mobile")}
                    className="h-8 w-8 p-0"
                  >
                    <Smartphone className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 w-full p-4 flex items-center justify-center overflow-hidden">
                <div
                  className={`premium-card overflow-hidden transition-all duration-300 ${
                    viewportSize === "desktop"
                      ? "w-full h-full"
                      : viewportSize === "tablet"
                        ? "w-[768px] max-h-full"
                        : "w-[375px] max-h-full"
                  }`}
                >
                  {!originalCode && !editedCode ? (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {isGenerating ? (
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto pulse-glow">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                          <p className="text-purple-300 font-medium">Generating preview...</p>
                        </div>
                      ) : (
                        <p>No preview available yet</p>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <iframe
                        key={previewKey}
                        srcDoc={previewContent}
                        className="w-full h-full absolute inset-0 z-10 rounded-lg"
                        title="Preview"
                        sandbox="allow-scripts"
                        style={{
                          backgroundColor: '#020202',
                          opacity: 1,
                          transition: 'opacity 0.15s ease-in-out'
                        }}
                      />
                      {isGenerating && (
                        <div className="absolute bottom-4 right-4 z-20 glass px-3 py-2 rounded-full text-xs flex items-center">
                          <Loader2 className="w-3 h-3 mr-2 animate-spin text-purple-400" />
                          <span className="text-purple-300">Updating...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block w-full h-full">
          <ResizablePanelGroup direction="horizontal" className="w-full h-full">
            {/* Left Panel - Code & Controls */}
            <ResizablePanel defaultSize={65} minSize={30}>
              <div className="h-full w-full flex flex-col border-r border-purple-500/20">
                {/* Code Editor */}
                <div className="h-[65%] w-full border-b border-purple-500/20 flex flex-col">
                  <div className="flex items-center justify-between p-4 glass border-b border-purple-500/20">
                    <div className="flex items-center space-x-3">
                      <Code2 className="w-5 h-5 text-purple-400" />
                      <span className="font-medium">Generated Code</span>
                      {generationComplete && (
                        <div className="ml-4 flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">
                            {isEditable ? 'Edit Mode' : 'Read Only'}
                          </span>
                          <Switch
                            checked={isEditable}
                            onCheckedChange={(checked) => {
                              if (!checked && hasChanges) {
                                setShowSaveDialog(true);
                              } else {
                                setIsEditable(checked);
                              }
                            }}
                            disabled={isGenerating}
                            className="data-[state=checked]:bg-purple-600"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {isEditable && hasChanges && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveChanges}
                          className="h-9 px-3 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={!generatedCode || isGenerating}
                        className="h-9 px-3 text-purple-300 hover:text-purple-200"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copySuccess ? "Copied!" : "Copy Code"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 w-full overflow-hidden">
                    {isGenerating && !generatedCode ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 mx-auto pulse-glow">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                          <h3 className="text-xl font-semibold text-purple-300 mb-2">Generating Code</h3>
                          <p className="text-muted-foreground">AI is crafting your perfect website...</p>
                        </div>
                      </div>
                    ) : (
                      <CodeEditor
                        code={isEditable ? editedCode : originalCode}
                        isEditable={isEditable && generationComplete}
                        onChange={(newCode) => setEditedCode(newCode)}
                      />
                    )}
                  </div>
                </div>

                {/* Controls Panel */}
                <div className="h-[35%] w-full p-4 flex flex-col overflow-hidden">
                  <div className="mb-4 flex-shrink-0">
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="font-medium text-purple-300">New Prompt</span>
                    </div>
                    <div className="relative">
                      <Textarea
                        value={newPrompt}
                        onChange={(e) => setNewPrompt(e.target.value)}
                        placeholder="Describe changes, add features, or request modifications..."
                        className="input-premium min-h-[80px] pr-16 resize-none w-full"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendNewPrompt()
                          }
                        }}
                        disabled={isGenerating}
                      />
                      <Button
                        onClick={handleSendNewPrompt}
                        disabled={!newPrompt.trim() || isGenerating}
                        className={`absolute bottom-3 right-3 h-10 px-4 ${
                          newPrompt.trim() 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    {prompt && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-muted-foreground">Previous Prompt:</span>
                        <ScrollArea className="h-12 w-full rounded-lg glass border border-purple-500/20 p-3 mt-1">
                          <p className="text-sm text-muted-foreground">{prompt}</p>
                        </ScrollArea>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center space-x-2 mb-3">
                      <Settings className="w-5 h-5 text-purple-400" />
                      <span className="font-medium text-purple-300">AI Work Steps</span>
                    </div>
                    <div className="h-[calc(100%-32px)] overflow-hidden">
                      <WorkSteps
                        isGenerating={isGenerating}
                        generationComplete={generationComplete}
                        generatedCode={isEditable ? editedCode : generatedCode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-purple-500/20 hover:bg-purple-500/40 transition-colors" />

            {/* Right Panel - Preview */}
            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full w-full flex flex-col">
                <div className="p-4 glass border-b border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">Live Preview</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {generationComplete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshPreview}
                        className="h-9 px-3 text-purple-300 hover:text-purple-200"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    )}
                    <Button
                      variant={viewportSize === "desktop" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewportSize("desktop")}
                      className="h-9 w-9 p-0"
                    >
                      <Laptop className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewportSize === "tablet" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewportSize("tablet")}
                      className="h-9 w-9 p-0"
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewportSize === "mobile" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewportSize("mobile")}
                      className="h-9 w-9 p-0"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 w-full p-4 flex items-center justify-center overflow-hidden">
                  <div
                    className={`premium-card overflow-hidden transition-all duration-300 ${
                      viewportSize === "desktop"
                        ? "w-full h-full"
                        : viewportSize === "tablet"
                          ? "w-[768px] max-h-full"
                          : "w-[375px] max-h-full"
                    }`}
                  >
                    {!originalCode && !editedCode ? (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        {isGenerating ? (
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 mx-auto pulse-glow">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                            <h3 className="text-lg font-semibold text-purple-300 mb-2">Generating Preview</h3>
                            <p className="text-sm text-muted-foreground">Your website is coming to life...</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p>No preview available yet</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <iframe
                          key={previewKey}
                          srcDoc={previewContent}
                          className="w-full h-full absolute inset-0 z-10 rounded-lg"
                          title="Preview"
                          sandbox="allow-scripts"
                          style={{
                            backgroundColor: '#020202',
                            opacity: 1,
                            transition: 'opacity 0.15s ease-in-out'
                          }}
                        />
                        {isGenerating && (
                          <div className="absolute bottom-4 right-4 z-20 glass px-4 py-2 rounded-full text-sm flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-400" />
                            <span className="text-purple-300">Updating preview...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="glass-strong border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-purple-300">Save Changes?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Do you want to save your changes before switching to read-only mode?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setEditedCode(originalCode);
                setIsEditable(false);
                setShowSaveDialog(false);
              }}
              className="border-purple-500/30 text-muted-foreground hover:bg-purple-500/10 hover:text-purple-300"
            >
              Don't Save
            </Button>
            <Button
              onClick={() => {
                saveChanges();
                setIsEditable(false);
                setShowSaveDialog(false);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}