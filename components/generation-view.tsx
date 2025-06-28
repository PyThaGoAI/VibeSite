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
  Minimize2,
  Crown,
  Star,
  Diamond,
  Gem
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
  provider = 'gemini',
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
          background-color: #010101;
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
      'gemini': { name: 'GEMINI', color: 'from-blue-500 via-purple-500 to-pink-500', icon: Gem },
      'deepseek': { name: 'DEEPSEEK', color: 'from-purple-500 via-pink-500 to-red-500', icon: Crown },
      'openrouter': { name: 'OPENROUTER', color: 'from-green-500 via-blue-500 to-purple-500', icon: Star },
      'openai_compatible': { name: 'CUSTOM API', color: 'from-orange-500 via-red-500 to-pink-500', icon: Diamond },
      'ollama': { name: 'OLLAMA', color: 'from-gray-500 to-gray-700', icon: Sparkles },
      'lm_studio': { name: 'LM STUDIO', color: 'from-indigo-500 via-purple-500 to-pink-500', icon: Zap }
    }
    return providers[provider as keyof typeof providers] || { name: 'AI', color: 'from-gray-500 to-gray-600', icon: Sparkles }
  }

  const providerInfo = getProviderInfo()
  const ProviderIcon = providerInfo.icon

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Ultra Premium Header */}
      <header className="w-full glass-strong border-b border-purple-500/20 p-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-6 min-w-0 flex-1">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${providerInfo.color} flex items-center justify-center flex-shrink-0 neon-glow`}>
                <ProviderIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-white">PythaGO AI</h1>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 px-3 py-1 font-semibold">
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
              <p className="text-sm text-muted-foreground hidden sm:block font-medium">
                AI Code Generation • {providerInfo.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-10 w-10 p-0 hover:bg-purple-500/10 text-purple-300 rounded-xl"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              disabled={isGenerating}
              className="h-10 px-4 hover:bg-purple-500/10 text-purple-300 rounded-xl font-semibold"
            >
              <Home className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadCode}
              disabled={!generatedCode || isGenerating}
              className="h-10 px-4 hover:bg-purple-500/10 text-purple-300 rounded-xl font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Tab Navigation */}
      <div className="md:hidden w-full flex glass border-b border-purple-500/20">
        <button
          className={`flex-1 py-4 text-sm font-semibold transition-all ${
            activeTab === "code" 
              ? "text-purple-300 border-b-2 border-purple-500 bg-purple-500/10" 
              : "text-muted-foreground hover:text-purple-300"
          }`}
          onClick={() => setActiveTab("code")}
        >
          <Code2 className="w-5 h-5 mx-auto mb-1" />
          CODE
        </button>
        <button
          className={`flex-1 py-4 text-sm font-semibold transition-all ${
            activeTab === "preview" 
              ? "text-purple-300 border-b-2 border-purple-500 bg-purple-500/10" 
              : "text-muted-foreground hover:text-purple-300"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          <Eye className="w-5 h-5 mx-auto mb-1" />
          PREVIEW
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden w-full flex flex-col">
          {activeTab === "code" ? (
            <>
              {/* Enhanced Code Editor */}
              <div className="h-[60%] w-full border-b border-purple-500/20 flex flex-col">
                <div className="flex items-center justify-between p-4 glass border-b border-purple-500/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Generated Code</span>
                    {generationComplete && (
                      <div className="flex items-center space-x-3">
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
                        className="h-9 px-3 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-xl"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!generatedCode || isGenerating}
                      className="h-9 px-3 text-purple-300 hover:text-purple-200 rounded-xl"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copySuccess ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 w-full overflow-hidden">
                  {isGenerating && !generatedCode ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center mb-6 mx-auto pulse-glow">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <p className="text-purple-300 font-semibold text-lg">Generating code...</p>
                        <p className="text-sm text-muted-foreground mt-2">AI is crafting your masterpiece</p>
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

              {/* Enhanced Controls */}
              <div className="h-[40%] w-full p-6 flex flex-col overflow-hidden">
                <div className="mb-6 flex-shrink-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-purple-300">New Prompt</span>
                  </div>
                  <div className="relative">
                    <Textarea
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      placeholder="Describe changes or new features..."
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
                      size="sm"
                      onClick={handleSendNewPrompt}
                      disabled={!newPrompt.trim() || isGenerating}
                      className={`absolute bottom-3 right-3 h-10 w-10 p-0 rounded-xl ${
                        newPrompt.trim() 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <ArrowRight className={`h-4 w-4 ${newPrompt.trim() ? 'text-white' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                  {prompt && (
                    <div className="mt-4">
                      <span className="text-sm font-semibold text-muted-foreground">Previous:</span>
                      <ScrollArea className="h-12 w-full rounded-xl glass border border-purple-500/20 p-3 mt-2">
                        <p className="text-sm text-muted-foreground">{prompt}</p>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Settings className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-purple-300">AI Work Steps</span>
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
            </>
          ) : (
            /* Enhanced Preview for Mobile */
            <>
              <div className="p-4 glass border-b border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">Live Preview</span>
                </div>
                <div className="flex items-center space-x-2">
                  {generationComplete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshPreview}
                      className="h-9 px-3 text-purple-300 hover:text-purple-200 rounded-xl"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      <span className="text-sm">Refresh</span>
                    </Button>
                  )}
                  <Button
                    variant={viewportSize === "desktop" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize("desktop")}
                    className="h-9 w-9 p-0 rounded-xl"
                  >
                    <Laptop className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewportSize === "tablet" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize("tablet")}
                    className="h-9 w-9 p-0 rounded-xl"
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewportSize === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewportSize("mobile")}
                    className="h-9 w-9 p-0 rounded-xl"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 w-full p-6 flex items-center justify-center overflow-hidden">
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
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center mb-6 mx-auto pulse-glow">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                          <p className="text-purple-300 font-semibold text-lg">Generating preview...</p>
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
                        className="w-full h-full absolute inset-0 z-10 rounded-2xl"
                        title="Preview"
                        sandbox="allow-scripts"
                        style={{
                          backgroundColor: '#010101',
                          opacity: 1,
                          transition: 'opacity 0.15s ease-in-out'
                        }}
                      />
                      {isGenerating && (
                        <div className="absolute bottom-6 right-6 z-20 glass px-4 py-3 rounded-2xl text-sm flex items-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-400" />
                          <span className="text-purple-300 font-semibold">Updating...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Desktop View */}
        <div className="hidden md:block w-full h-full">
          <ResizablePanelGroup direction="horizontal" className="w-full h-full">
            {/* Left Panel - Code & Controls */}
            <ResizablePanel defaultSize={65} minSize={30}>
              <div className="h-full w-full flex flex-col border-r border-purple-500/20">
                {/* Enhanced Code Editor */}
                <div className="h-[65%] w-full border-b border-purple-500/20 flex flex-col">
                  <div className="flex items-center justify-between p-6 glass border-b border-purple-500/20">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-lg">Generated Code</span>
                      {generationComplete && (
                        <div className="ml-6 flex items-center space-x-4">
                          <span className="text-muted-foreground">
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
                    <div className="flex items-center space-x-3">
                      {isEditable && hasChanges && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveChanges}
                          className="h-10 px-4 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-xl font-semibold"
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
                        className="h-10 px-4 text-purple-300 hover:text-purple-200 rounded-xl font-semibold"
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
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center mb-8 mx-auto pulse-glow">
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                          </div>
                          <h3 className="text-2xl font-bold text-purple-300 mb-3">Generating Code</h3>
                          <p className="text-muted-foreground text-lg">AI is crafting your perfect website...</p>
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

                {/* Enhanced Controls Panel */}
                <div className="h-[35%] w-full p-6 flex flex-col overflow-hidden">
                  <div className="mb-6 flex-shrink-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-lg text-purple-300">New Prompt</span>
                    </div>
                    <div className="relative">
                      <Textarea
                        value={newPrompt}
                        onChange={(e) => setNewPrompt(e.target.value)}
                        placeholder="Describe changes, add features, or request modifications..."
                        className="input-premium min-h-[100px] pr-20 resize-none w-full text-lg"
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
                        className={`absolute bottom-4 right-4 h-12 px-6 rounded-xl font-semibold ${
                          newPrompt.trim() 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                    {prompt && (
                      <div className="mt-4">
                        <span className="font-semibold text-muted-foreground">Previous Prompt:</span>
                        <ScrollArea className="h-16 w-full rounded-xl glass border border-purple-500/20 p-4 mt-2">
                          <p className="text-muted-foreground">{prompt}</p>
                        </ScrollArea>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-lg text-purple-300">AI Work Steps</span>
                    </div>
                    <div className="h-[calc(100%-40px)] overflow-hidden">
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

            {/* Right Panel - Enhanced Preview */}
            <ResizablePanel defaultSize={35} minSize={25}>
              <div className="h-full w-full flex flex-col">
                <div className="p-6 glass border-b border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg">Live Preview</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {generationComplete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshPreview}
                        className="h-10 px-4 text-purple-300 hover:text-purple-200 rounded-xl font-semibold"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    )}
                    <Button
                      variant={viewportSize === "desktop" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewportSize("desktop")}
                      className="h-10 w-10 p-0 rounded-xl"
                    >
                      <Laptop className="w-5 h-5" />
                    </Button>
                    <Button
                      variant={viewportSize === "tablet" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewportSize("tablet")}
                      className="h-10 w-10 p-0 rounded-xl"
                    >
                      <Tablet className="w-5 h-5" />
                    </Button>
                    <Button
                      variant={viewportSize === "mobile" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewportSize("mobile")}
                      className="h-10 w-10 p-0 rounded-xl"
                    >
                      <Smartphone className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 w-full p-6 flex items-center justify-center overflow-hidden">
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
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center mb-8 mx-auto pulse-glow">
                              <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                            <h3 className="text-xl font-bold text-purple-300 mb-3">Generating Preview</h3>
                            <p className="text-muted-foreground">Your website is coming to life...</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                            <p className="text-lg">No preview available yet</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <iframe
                          key={previewKey}
                          srcDoc={previewContent}
                          className="w-full h-full absolute inset-0 z-10 rounded-2xl"
                          title="Preview"
                          sandbox="allow-scripts"
                          style={{
                            backgroundColor: '#010101',
                            opacity: 1,
                            transition: 'opacity 0.15s ease-in-out'
                          }}
                        />
                        {isGenerating && (
                          <div className="absolute bottom-6 right-6 z-20 glass px-6 py-3 rounded-2xl flex items-center">
                            <Loader2 className="w-5 h-5 mr-3 animate-spin text-purple-400" />
                            <span className="text-purple-300 font-semibold">Updating preview...</span>
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

      {/* Enhanced Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="glass-strong border-purple-500/30 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-300 text-xl font-bold">Save Changes?</DialogTitle>
            <DialogDescription className="text-muted-foreground text-lg">
              Do you want to save your changes before switching to read-only mode?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setEditedCode(originalCode);
                setIsEditable(false);
                setShowSaveDialog(false);
              }}
              className="border-purple-500/30 text-muted-foreground hover:bg-purple-500/10 hover:text-purple-300 rounded-xl px-6 py-3"
            >
              Don't Save
            </Button>
            <Button
              onClick={() => {
                saveChanges();
                setIsEditable(false);
                setShowSaveDialog(false);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl px-6 py-3 font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}