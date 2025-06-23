"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Brain, ChevronDown, Sparkles } from "lucide-react"

interface ThinkingIndicatorProps {
  thinkingOutput: string
  isThinking: boolean
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export function ThinkingIndicator({
  thinkingOutput,
  isThinking,
  position = "top-left"
}: ThinkingIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dots, setDots] = useState("")
  const [hasFinished, setHasFinished] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      dropdownRef.current.scrollTop = dropdownRef.current.scrollHeight
    }
  }, [isOpen, thinkingOutput])

  useEffect(() => {
    if (!isThinking) return

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "") return "."
        if (prev === ".") return ".."
        if (prev === "..") return "..."
        return ""
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isThinking])

  useEffect(() => {
    if (isThinking) {
      setHasFinished(false)
    } else if (thinkingOutput && !hasFinished) {
      setHasFinished(true)
    }
  }, [isThinking, thinkingOutput, hasFinished])

  if (!thinkingOutput && !isThinking) return null

  const formattedThinking = thinkingOutput
    .split('\n')
    .map((line, index) => <div key={index} className="py-0.5">{line}</div>)

  let dropdownPosition = "left-0 top-full"
  if (position === "top-right") dropdownPosition = "right-0 top-full"
  if (position === "bottom-left") dropdownPosition = "left-0 bottom-full"
  if (position === "bottom-right") dropdownPosition = "right-0 bottom-full"

  return (
    <div className="relative">
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
          isOpen 
            ? 'glass-strong border border-purple-500/40' 
            : 'glass border border-purple-500/20 hover:border-purple-500/40'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
          isThinking 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
            : 'bg-gradient-to-br from-green-500 to-emerald-500'
        }`}>
          {isThinking ? (
            <Loader2 className="w-3 h-3 text-white animate-spin" />
          ) : (
            <Brain className="w-3 h-3 text-white" />
          )}
        </div>
        
        <span className={`text-sm font-medium min-w-[100px] transition-all duration-300 ${
          isThinking 
            ? 'text-purple-300' 
            : hasFinished 
              ? 'text-green-400' 
              : 'text-purple-300'
        }`}>
          {isThinking ? `Thinking${dots}` :
           hasFinished ? "Thinking Complete" : "Thinking"}
        </span>
        
        <ChevronDown className={`w-4 h-4 text-purple-300 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute ${dropdownPosition} mt-2 p-4 glass-strong border border-purple-500/30 rounded-xl z-50 max-h-[400px] w-[450px] overflow-y-auto`}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-purple-300">AI Thinking Process</h4>
          </div>
          
          <div className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {formattedThinking.length > 0 ? (
              <div className="space-y-1">
                {formattedThinking}
              </div>
            ) : (
              <div className="text-gray-500 italic flex items-center space-x-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Waiting for AI thoughts...</span>
              </div>
            )}
          </div>
          
          {hasFinished && (
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <div className="flex items-center space-x-2 text-green-400">
                <Brain className="w-3 h-3" />
                <span className="text-xs font-medium">Thinking process completed</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}