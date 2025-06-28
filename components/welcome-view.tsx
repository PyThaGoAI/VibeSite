"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, Zap, Code2, Palette, Wand2, ArrowRight, Settings, Brain, Cpu, Globe, Rocket, Star, Crown, Diamond, Gem } from "lucide-react"
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleClass("opacity-100 scale-100")
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Setează provider-ul implicit la încărcare
  useEffect(() => {
    const fetchDefaultProvider = async () => {
      try {
        const response = await fetch('/api/get-default-provider')
        const data = await response.json()
        
        if (response.ok && data.defaultProvider) {
          console.log('[DEBUG] Setting default provider:', data.defaultProvider)
          setSelectedProvider(data.defaultProvider)
        } else {
          // Fallback la gemini dacă nu se poate obține provider-ul implicit
          console.log('[DEBUG] Fallback to gemini provider')
          setSelectedProvider("gemini")
        }
      } catch (error) {
        console.error('Error fetching default provider:', error)
        // Fallback la gemini în caz de eroare
        setSelectedProvider("gemini")
      }
    }

    // Doar dacă nu este deja setat un provider
    if (!selectedProvider) {
      fetchDefaultProvider()
    }
  }, [selectedProvider, setSelectedProvider])

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedProvider) {
        console.log('[DEBUG] No provider selected, skipping model fetch')
        return
      }

      console.log('[DEBUG] Fetching models for provider:', selectedProvider)
      setIsLoadingModels(true)
      setSelectedModel("")
      setModels([])

      try {
        const response = await fetch(`/api/get-models?provider=${selectedProvider}`)
        const data = await response.json()

        console.log('[DEBUG] Models API response:', { ok: response.ok, status: response.status, data })

        if (!response.ok) {
          if (data && data.error) {
            console.error('[DEBUG] API Error:', data.error)
            throw new Error(data.error)
          } else {
            throw new Error(`HTTP ${response.status}: Error fetching models`)
          }
        }

        console.log('[DEBUG] Successfully fetched models:', data)
        setModels(data)
        if (data.length > 0) {
          setSelectedModel(data[0].id)
          console.log('[DEBUG] Auto-selected first model:', data[0].id)
        }
      } catch (error) {
        console.error('Error fetching models:', error)
        setModels([])
        setSelectedModel("")

        if (error instanceof Error) {
          toast.error(error.message || 'Models could not be loaded. Please try again later.');
        } else {
          toast.error('Models could not be loaded. Please try again later.');
        }
      } finally {
        setIsLoadingModels(false)
      }
    }

    fetchModels()
  }, [selectedProvider, setSelectedModel])

  // Enhanced particle system
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 25 + 's'
      particle.style.animationDuration = (Math.random() * 15 + 20) + 's'
      
      // Random particle colors
      const colors = [
        'rgba(139, 92, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(192, 132, 252, 0.8)',
        'rgba(232, 121, 249, 0.8)'
      ]
      particle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%)`
      
      document.querySelector('.particles')?.appendChild(particle)

      setTimeout(() => {
        particle.remove()
      }, 30000)
    }

    const interval = setInterval(createParticle, 1500)
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const providerConfigs = {
    gemini: {
      name: 'Google Gemini',
      icon: <Gem className="w-4 h-4" />,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      description: 'Google\'s most advanced AI'
    },
    openrouter: {
      name: 'OpenRouter',
      icon: <Globe className="w-4 h-4" />,
      gradient: 'from-green-500 via-blue-500 to-purple-500',
      description: 'Access to multiple AI models'
    },
    deepseek: {
      name: 'DeepSeek',
      icon: <Brain className="w-4 h-4" />,
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      description: 'Advanced reasoning AI'
    },
    openai_compatible: {
      name: 'Custom API',
      icon: <Settings className="w-4 h-4" />,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      description: 'Your custom endpoint'
    },
    ollama: {
      name: 'Ollama',
      icon: <Cpu className="w-4 h-4" />,
      gradient: 'from-gray-500 via-gray-600 to-gray-700',
      description: 'Local AI models'
    },
    lm_studio: {
      name: 'LM Studio',
      icon: <Diamond className="w-4 h-4" />,
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      description: 'Local studio environment'
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* Enhanced Animated Background */}
      <div className="particles"></div>
      
      {/* Interactive background elements */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.05), transparent 40%)`
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full flex flex-col">
        {/* Ultra Premium Header */}
        <header className="w-full p-6 lg:p-8">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center flex-shrink-0 neon-glow">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold gradient-text text-display">PythaGO AI</h1>
                <p className="text-sm text-muted-foreground font-medium">Ultra Premium Code Generator 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="status-online w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground hidden sm:inline font-medium">AI Online</span>
              <div className="px-3 py-1 rounded-full glass text-xs font-semibold text-purple-300">
                v2025.1
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section Enhanced */}
        <div className="flex-1 w-full flex items-center justify-center p-6">
          <div className="w-full max-w-7xl mx-auto">
            {/* Main Title with Enhanced Animation */}
            <div className={`text-center mb-16 transition-all duration-1000 ease-out ${titleClass}`}>
              <div className="inline-flex items-center space-x-3 mb-6 px-6 py-3 rounded-full glass-strong border border-purple-500/30 hover-lift">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-purple-300 font-semibold">AI-Powered Development Platform</span>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight px-2 text-display">
                <span className="gradient-text block">Build Anything</span>
                <span className="text-white block">With AI Magic</span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 text-body">
                Transform your ideas into beautiful, functional websites using the power of 
                <span className="gradient-text font-semibold"> artificial intelligence</span>
              </p>
            </div>

            {/* Ultra Premium Input Card */}
            <div className="w-full premium-card p-8 lg:p-12 mb-12 hover-lift">
              <div className="relative w-full">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-purple-300 text-display">Describe Your Vision</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>
                
                <div className="relative w-full">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Create a modern landing page for a tech startup with a hero section, features grid, and contact form..."
                    className="input-premium min-h-[140px] text-lg resize-none border-0 bg-transparent focus:ring-0 focus:outline-none w-full pr-24 text-body"
                  />
                  
                  <div className="absolute bottom-4 right-4 flex flex-col sm:flex-row items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground order-2 sm:order-1">
                      <Brain className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline font-medium">AI Ready</span>
                    </div>
                    <Button
                      onClick={onGenerate}
                      disabled={!prompt.trim() || !selectedModel}
                      className="btn-premium h-14 px-8 text-lg font-semibold order-1 sm:order-2 flex-shrink-0 group"
                    >
                      <Zap className="w-5 h-5 mr-3 flex-shrink-0 group-hover:animate-pulse" />
                      <span>Generate Magic</span>
                      <ArrowRight className="w-5 h-5 ml-3 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Configuration Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* AI Provider Selection */}
              <div className="w-full premium-card p-8 hover-lift">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-lg text-display">AI Provider</span>
                    <p className="text-sm text-muted-foreground">Choose your AI engine</p>
                  </div>
                </div>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="input-premium h-14 w-full text-lg">
                    <SelectValue placeholder="Choose a provider..." />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-purple-500/20 w-full">
                    {Object.entries(providerConfigs).map(([key, config]) => (
                      <SelectItem key={key} value={key} className="focus:bg-purple-500/10 p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                            {config.icon}
                          </div>
                          <div>
                            <div className="font-medium">{config.name}</div>
                            <div className="text-xs text-muted-foreground">{config.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Selection */}
              <div className="w-full premium-card p-8 hover-lift">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-lg text-display">AI Model</span>
                    <p className="text-sm text-muted-foreground">Select intelligence level</p>
                  </div>
                </div>
                <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedProvider || isLoadingModels}>
                  <SelectTrigger className="input-premium h-14 w-full text-lg">
                    <SelectValue placeholder={selectedProvider ? "Choose a model..." : "Select a provider first"} />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-purple-500/20 w-full">
                    {isLoadingModels ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 mr-3 animate-spin text-purple-400" />
                        <span className="text-lg">Loading models...</span>
                      </div>
                    ) : models.length > 0 ? (
                      models.map((model, index) => (
                        <SelectItem key={`${index}-${model.id}`} value={model.id} className="focus:bg-purple-500/10 p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <span className="font-medium">{model.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        {selectedProvider ? "No models available" : "Select a provider first"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <div className="w-full text-center mb-12">
              <Button
                variant="ghost"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover-lift"
              >
                <Settings className="w-5 h-5 mr-3" />
                Advanced Settings
                <ArrowRight className={`w-5 h-5 ml-3 transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`} />
              </Button>
            </div>

            {/* Enhanced Advanced Settings */}
            {showAdvanced && (
              <div className="w-full space-y-8 animate-in slide-in-from-top-4 duration-500">
                {/* System Prompt */}
                <div className="w-full premium-card p-8 hover-lift">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-display">System Prompt</span>
                      <p className="text-sm text-muted-foreground">Configure AI behavior</p>
                    </div>
                  </div>
                  <Select value={selectedSystemPrompt} onValueChange={setSelectedSystemPrompt}>
                    <SelectTrigger className="input-premium h-14 w-full text-lg">
                      <SelectValue placeholder="Choose a system prompt..." />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-purple-500/20 w-full">
                      <SelectItem value="default" className="focus:bg-purple-500/10 p-4">
                        <div className="flex flex-col">
                          <span className="font-medium">Default</span>
                          <span className="text-sm text-muted-foreground">Standard code generation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="thinking" className="focus:bg-purple-500/10 p-4">
                        <div className="flex flex-col">
                          <span className="font-medium">Thinking</span>
                          <span className="text-sm text-muted-foreground">Enhanced reasoning process</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="custom" className="focus:bg-purple-500/10 p-4">
                        <div className="flex flex-col">
                          <span className="font-medium">Custom</span>
                          <span className="text-sm text-muted-foreground">Define your own prompt</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom System Prompt */}
                {selectedSystemPrompt === 'custom' && (
                  <div className="w-full premium-card p-8 hover-lift">
                    <div className="flex items-center space-x-3 mb-6">
                      <Palette className="w-6 h-6 text-purple-400 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-lg text-display">Custom System Prompt</span>
                        <p className="text-sm text-muted-foreground">Define AI personality and behavior</p>
                      </div>
                    </div>
                    <Textarea
                      value={customSystemPrompt}
                      onChange={(e) => setCustomSystemPrompt(e.target.value)}
                      placeholder="Enter a custom system prompt to override the default..."
                      className="input-premium min-h-[120px] resize-none w-full text-lg"
                    />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Your custom prompt will be used for this generation and subsequent regenerations.
                    </p>
                  </div>
                )}

                {/* Max Tokens */}
                <div className="w-full premium-card p-8 hover-lift">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg text-display">Output Tokens</span>
                      <p className="text-sm text-muted-foreground">Control response length</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Input
                      type="number"
                      value={maxTokens || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                        setMaxTokens(value && !isNaN(value) && value > 0 ? value : undefined);
                      }}
                      placeholder="Auto (model default)"
                      className="input-premium h-14 flex-1 text-lg"
                      min="100"
                      step="100"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setMaxTokens(undefined)}
                      className="h-14 px-8 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 flex-shrink-0 text-lg font-semibold"
                    >
                      Reset
                    </Button>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Control the maximum length of generated code. Higher values allow for more detailed implementations.
                  </p>
                </div>
              </div>
            )}

            {/* Enhanced Quick Examples */}
            <div className="w-full mt-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 text-display gradient-text">Quick Start Examples</h3>
                <p className="text-lg text-muted-foreground">Get inspired with these premium templates</p>
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Landing Page",
                    description: "Modern startup landing with hero section",
                    prompt: "Create a modern landing page for a tech startup with a hero section, features grid, and contact form",
                    icon: Sparkles,
                    gradient: "from-blue-500 via-purple-500 to-pink-500",
                    category: "Business"
                  },
                  {
                    title: "Dashboard",
                    description: "Analytics dashboard with charts",
                    prompt: "Build a responsive analytics dashboard with charts, metrics cards, and a sidebar navigation",
                    icon: Code2,
                    gradient: "from-green-500 via-blue-500 to-purple-500",
                    category: "Analytics"
                  },
                  {
                    title: "Portfolio",
                    description: "Creative portfolio showcase",
                    prompt: "Design a creative portfolio website with project gallery, about section, and contact form",
                    icon: Palette,
                    gradient: "from-purple-500 via-pink-500 to-red-500",
                    category: "Creative"
                  }
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example.prompt)}
                    className="w-full premium-card p-8 text-left hover-lift transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-xs font-semibold text-purple-300 rounded-bl-lg">
                      {example.category}
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${example.gradient} flex items-center justify-center mb-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <example.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-xl mb-3 group-hover:text-purple-300 transition-colors text-display">
                      {example.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-body">
                      {example.description}
                    </p>
                    <div className="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span className="text-sm font-semibold">Try this example</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
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