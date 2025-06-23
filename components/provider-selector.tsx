"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Cloud, Server, Cpu, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { LLMProvider } from "@/lib/providers/config"

interface Provider {
  id: LLMProvider
  name: string
  description: string
  isLocal: boolean
}

interface ProviderSelectorProps {
  selectedProvider: string
  setSelectedProvider: (value: string) => void
  onProviderChange: () => void
}

export function ProviderSelector({
  selectedProvider,
  setSelectedProvider,
  onProviderChange
}: ProviderSelectorProps) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/get-models', {
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error('Error fetching providers')
        }
        const data = await response.json()
        setProviders(data)

        if (!selectedProvider && data.length > 0) {
          try {
            const defaultResponse = await fetch('/api/get-default-provider')
            if (defaultResponse.ok) {
              const { defaultProvider } = await defaultResponse.json()
              const providerExists = data.some(p => p.id === defaultProvider)
              if (providerExists) {
                setSelectedProvider(defaultProvider)
              } else {
                setSelectedProvider(data[0].id)
              }
            } else {
              setSelectedProvider(data[0].id)
            }
          } catch (error) {
            console.error('Error fetching default provider:', error)
            setSelectedProvider(data[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching providers:', error)
        toast.error('Providers could not be loaded.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviders()
  }, [selectedProvider, setSelectedProvider])

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value)
    onProviderChange()
  }

  const getProviderIcon = (provider: Provider) => {
    if (provider.isLocal) {
      return provider.id === 'ollama' ? Server : Cpu
    }
    return provider.id === 'deepseek' ? Sparkles : Cloud
  }

  const getProviderColor = (provider: Provider) => {
    const colors = {
      'deepseek': 'from-blue-500 to-cyan-500',
      'openai_compatible': 'from-green-500 to-emerald-500',
      'ollama': 'from-orange-500 to-red-500',
      'lm_studio': 'from-purple-500 to-pink-500'
    }
    return colors[provider.id as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="w-full">
      <Select value={selectedProvider} onValueChange={handleProviderChange}>
        <SelectTrigger className="input-premium h-12">
          <SelectValue placeholder="Choose an AI provider..." />
        </SelectTrigger>
        <SelectContent className="glass-strong border-purple-500/20">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-400" />
              <span>Loading providers...</span>
            </div>
          ) : providers.length > 0 ? (
            providers.map((provider) => {
              const Icon = getProviderIcon(provider)
              const colorClass = getProviderColor(provider)
              
              return (
                <SelectItem 
                  key={provider.id} 
                  value={provider.id}
                  className="focus:bg-purple-500/10 py-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{provider.name}</span>
                      <span className="text-xs text-muted-foreground">{provider.description}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          provider.isLocal 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {provider.isLocal ? 'Local' : 'Cloud'}
                        </span>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              )
            })
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No providers available
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}