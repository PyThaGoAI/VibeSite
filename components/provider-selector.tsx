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
      <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
        <span className="font-medium text-white">OpenRouter</span>
        <span className="text-xs bg-blue-500/20 text-blue-100 px-2 py-0.5 rounded-full">Cloud</span>
        <span className="text-xs text-white">AI Provider (fixed)</span>
      </div>
    </div>
  )
}