"use client"

import { useEffect, useState } from "react"
import { Sparkles, Code2, Zap } from "lucide-react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { icon: Sparkles, text: "Initializing AI Engine", color: "from-purple-500 to-pink-500" },
    { icon: Code2, text: "Loading Neural Networks", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, text: "Preparing Code Generation", color: "from-green-500 to-emerald-500" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        const increment = Math.random() * 15 + 5
        return Math.min(prev + increment, 100)
      })
    }, 200)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
    }, 800)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [])

  const CurrentIcon = steps[currentStep].icon

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="particles"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center mb-4 mx-auto pulse-glow`}>
            <CurrentIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            PythaGO AI
          </h1>
          <p className="text-muted-foreground">Premium Code Generator</p>
        </div>

        {/* Progress Section */}
        <div className="w-80 max-w-sm mx-auto">
          {/* Progress Bar */}
          <div className="relative mb-6">
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" 
                 style={{ left: `${progress}%`, transform: 'translateX(-50%)' }} />
          </div>

          {/* Current Step */}
          <div className="glass p-4 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-center space-x-3">
              <CurrentIcon className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                {steps[currentStep].text}
              </span>
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="mt-4">
            <span className="text-2xl font-bold gradient-text">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { icon: Sparkles, text: "AI Powered" },
            { icon: Code2, text: "Clean Code" },
            { icon: Zap, text: "Lightning Fast" }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`glass p-3 rounded-lg border border-purple-500/20 transition-all duration-500 ${
                index === currentStep ? 'scale-105 border-purple-500/40' : 'opacity-60'
              }`}
            >
              <feature.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-purple-500 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-pink-500 rounded-full animate-pulse opacity-40" />
      <div className="absolute bottom-32 left-40 w-3 h-3 bg-cyan-500 rounded-full animate-pulse opacity-50" />
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-500 rounded-full animate-pulse opacity-60" />
    </div>
  )
}