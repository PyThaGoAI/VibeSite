"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, Zap, Code2, Palette, Wand2, ArrowRight, Settings, Brain } from "lucide-react"
import { toast } from "sonner"
import { ProviderSelector } from "@/components/provider-selector"
import { PremiumFooter } from "@/components/premium-footer"

interface Model {
  id: string
  name: string
}

interface WelcomeViewProps {
  prompt: string
  setPrompt: (value: string) => void
  selectedModel: string
  setSelectedModel: (value: string) => void
  selectedProvider: string
  setSelectedProvider: (value: string) => void
  selectedSystemPrompt: string
  setSelectedSystemPrompt: (value: string) => void
  customSystemPrompt: string
  setCustomSystemPrompt: (value: string) => void
  maxTokens: number | undefined
  setMaxTokens: (value: number | undefined) => void
  onGenerate: () => void
}

export function WelcomeView({
  prompt,
  setPrompt,
  selectedModel,
  setSelectedModel,
  selectedProvider,
  setSelectedProvider,
  selectedSystemPrompt,
  setSelectedSystemPrompt,
  customSystemPrompt,
  setCustomSystemPrompt,
  maxTokens,
  setMaxTokens,
  onGenerate
}: WelcomeViewProps) {
  const [titleClass, setTitleClass] = useState("opacity-0 scale-95")
  const [models, setModels] = useState<Model[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleClass("opacity-100 scale-100")
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedProvider) return;

      setIsLoadingModels(true)
      setSelectedModel("")
      setModels([])

      try {
        const response = await fetch(`/api/get-models?provider=${selectedProvider}`)
        const data = await response.json()

        if (!response.ok) {
          if (data && data.error) {
            throw new Error(data.error)
          } else {
            throw new Error('Error fetching models')
          }
        }

        setModels(data)
        if (data.length > 0) {
          setSelectedModel(data[0].id)
        }
      } catch (error) {
        console.error('Error fetching models:', error)
        setModels([])
        setSelectedModel("")

        if (error instanceof Error) {
          const errorMessage = error.message
          if (errorMessage.includes('Ollama')) {
            toast.error('Cannot connect to Ollama. Is the server running?')
          } else if (errorMessage.includes('LM Studio')) {
            toast.error('Cannot connect to LM Studio. Is the server running?')
          } else if (selectedProvider === 'deepseek' || selectedProvider === 'openai_compatible') {
            toast.error('Make sure the Base URL and API Keys are correct in your .env.local file.')
          } else {
            toast.error('Models could not be loaded. Please try again later.')
          }
        } else {
          toast.error('Models could not be loaded. Please try again later.')
        }
      } finally {
        setIsLoadingModels(false)
      }
    }

    fetchModels()
  }, [selectedProvider, setSelectedModel])

  // Create floating particles
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 20 + 's'
      particle.style.animationDuration = (Math.random() * 10 + 15) + 's'
      document.querySelector('.particles')?.appendChild(particle)

      setTimeout(() => {
        particle.remove()
      }, 25000)
    }

    const interval = setInterval(createParticle, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="particles"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full flex flex-col">
        {/* Header - 100% width */}
        <header className="w-full p-4 sm:p-6 lg:p-8">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Code2 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold gradient-text truncate">PythaGO AI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Premium Code Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="status-online w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground hidden sm:inline">Online</span>
            </div>
          </div>
        </header>

        {/* Hero Section - 100% width */}
        <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-6xl mx-auto">
            {/* Main Title */}
            <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ease-out ${titleClass}`}>
              <div className="inline-flex items-center space-x-2 mb-4 px-3 sm:px-4 py-2 rounded-full glass border border-purple-500/20">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-purple-300">AI-Powered Development</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
                <span className="gradient-text">Build Anything</span>
                <br />
                <span className="text-white">With AI Magic</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                Transform your ideas into beautiful, functional websites using the power of artificial intelligence
              </p>
            </div>

            {/* Main Input Card - 100% width */}
            <div className="w-full premium-card p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="relative w-full">
                <div className="flex items-center space-x-2 mb-4">
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-purple-300">Describe Your Vision</span>
                </div>
                
                <div className="relative w-full">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Create a modern landing page for a tech startup with a hero section, features grid, and contact form..."
                    className="input-premium min-h-[100px] sm:min-h-[120px] text-base sm:text-lg resize-none border-0 bg-transparent focus:ring-0 focus:outline-none w-full pr-16 sm:pr-20"
                  />
                  
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground order-2 sm:order-1">
                      <Brain className="w-3 h-3 flex-shrink-0" />
                      <span className="hidden sm:inline">AI Ready</span>
                    </div>
                    <Button
                      onClick={onGenerate}
                      disabled={!prompt.trim() || !selectedModel}
                      className="btn-premium h-10 sm:h-12 px-4 sm:px-8 text-sm sm:text-base font-semibold order-1 sm:order-2 flex-shrink-0"
                    >
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      <span className="hidden sm:inline">Generate</span>
                      <span className="sm:hidden">Go</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Grid - 100% width */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Provider Selection */}
              <div className="w-full premium-card p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">AI Provider</span>
                </div>
                <div className="w-full">
                  <ProviderSelector
                    selectedProvider={selectedProvider}
                    setSelectedProvider={setSelectedProvider}
                    onProviderChange={() => {}}
                  />
                </div>
              </div>

              {/* Model Selection */}
              <div className="w-full premium-card p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">Model</span>
                </div>
                <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedProvider || isLoadingModels}>
                  <SelectTrigger className="input-premium h-10 sm:h-12 w-full">
                    <SelectValue placeholder={selectedProvider ? "Choose a model..." : "Select a provider first"} />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-purple-500/20 w-full">
                    {isLoadingModels ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-400" />
                        <span>Loading models...</span>
                      </div>
                    ) : models.length > 0 ? (
                      models.map((model, index) => (
                        <SelectItem key={`${index}-${model.id}`} value={model.id} className="focus:bg-purple-500/10">
                          {model.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        {selectedProvider ? "No models available" : "Select a provider first"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <div className="w-full text-center mb-6 sm:mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
                <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              </Button>
            </div>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="w-full space-y-4 sm:space-y-6 animate-in slide-in-from-top-4 duration-300">
                {/* System Prompt */}
                <div className="w-full premium-card p-4 sm:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base">System Prompt</span>
                  </div>
                  <Select value={selectedSystemPrompt} onValueChange={setSelectedSystemPrompt}>
                    <SelectTrigger className="input-premium h-10 sm:h-12 w-full">
                      <SelectValue placeholder="Choose a system prompt..." />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-purple-500/20 w-full">
                      <SelectItem value="default" className="focus:bg-purple-500/10">
                        <div className="flex flex-col">
                          <span>Default</span>
                          <span className="text-xs text-muted-foreground">Standard code generation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="thinking" className="focus:bg-purple-500/10">
                        <div className="flex flex-col">
                          <span>Thinking</span>
                          <span className="text-xs text-muted-foreground">Enhanced reasoning process</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="custom" className="focus:bg-purple-500/10">
                        <div className="flex flex-col">
                          <span>Custom</span>
                          <span className="text-xs text-muted-foreground">Define your own prompt</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom System Prompt */}
                {selectedSystemPrompt === 'custom' && (
                  <div className="w-full premium-card p-4 sm:p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">Custom System Prompt</span>
                    </div>
                    <Textarea
                      value={customSystemPrompt}
                      onChange={(e) => setCustomSystemPrompt(e.target.value)}
                      placeholder="Enter a custom system prompt to override the default..."
                      className="input-premium min-h-[80px] sm:min-h-[100px] resize-none w-full"
                    />
                    <p className="mt-3 text-xs text-muted-foreground">
                      Your custom prompt will be used for this generation and subsequent regenerations.
                    </p>
                  </div>
                )}

                {/* Max Tokens */}
                <div className="w-full premium-card p-4 sm:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base">Output Tokens</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Input
                      type="number"
                      value={maxTokens || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                        setMaxTokens(value && !isNaN(value) && value > 0 ? value : undefined);
                      }}
                      placeholder="Auto (model default)"
                      className="input-premium h-10 sm:h-12 flex-1"
                      min="100"
                      step="100"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setMaxTokens(undefined)}
                      className="h-10 sm:h-12 px-4 sm:px-6 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 flex-shrink-0"
                    >
                      Reset
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Control the maximum length of generated code. Higher values allow for more detailed implementations.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Examples - 100% width */}
            <div className="w-full mt-8 sm:mt-12">
              <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-center">Quick Start Examples</h3>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Landing Page",
                    description: "Modern startup landing with hero section",
                    prompt: "Create a modern landing page for a tech startup with a hero section, features grid, and contact form",
                    icon: Sparkles,
                    gradient: "from-blue-500 to-cyan-500"
                  },
                  {
                    title: "Dashboard",
                    description: "Analytics dashboard with charts",
                    prompt: "Build a responsive analytics dashboard with charts, metrics cards, and a sidebar navigation",
                    icon: Code2,
                    gradient: "from-green-500 to-emerald-500"
                  },
                  {
                    title: "Portfolio",
                    description: "Creative portfolio showcase",
                    prompt: "Design a creative portfolio website with project gallery, about section, and contact form",
                    icon: Palette,
                    gradient: "from-purple-500 to-pink-500"
                  }
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example.prompt)}
                    className="w-full premium-card p-4 text-left hover:scale-105 transition-all duration-300 group"
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${example.gradient} flex items-center justify-center mb-3 flex-shrink-0`}>
                      <example.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1 group-hover:text-purple-300 transition-colors text-sm sm:text-base">
                      {example.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {example.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <PremiumFooter />
    </div>
  )
}