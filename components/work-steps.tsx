"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Circle, Loader2, Code2, Palette, Zap, Settings, Sparkles, Eye } from "lucide-react"

interface WorkStepsProps {
  isGenerating: boolean
  generationComplete: boolean
  generatedCode?: string
}

interface Step {
  id: string
  label: string
  icon: any
  detector: (code: string) => boolean
  completed: boolean
  color: string
}

export function WorkSteps({ isGenerating, generationComplete, generatedCode = "" }: WorkStepsProps) {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "init",
      label: "Initializing AI engine...",
      icon: Sparkles,
      detector: () => true,
      completed: false,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "html_structure",
      label: "Building HTML structure...",
      icon: Code2,
      detector: (code) => code.includes("<html") || code.includes("<body") || code.includes("<head"),
      completed: false,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "content",
      label: "Adding content elements...",
      icon: Eye,
      detector: (code) =>
        code.includes("<div") ||
        code.includes("<p") ||
        code.includes("<h1") ||
        code.includes("<span") ||
        code.includes("<img") ||
        code.includes("<ul") ||
        code.includes("<section"),
      completed: false,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "styles",
      label: "Applying beautiful styles...",
      icon: Palette,
      detector: (code) => code.includes("<style") || code.includes("class=") || code.includes("style="),
      completed: false,
      color: "from-orange-500 to-red-500"
    },
    {
      id: "javascript",
      label: "Implementing interactions...",
      icon: Zap,
      detector: (code) => {
        const hasJavaScript = code.includes("<script") ||
                             code.includes("function") ||
                             code.includes("addEventListener") ||
                             code.includes("document.") ||
                             code.includes("window.") ||
                             code.includes("const ") ||
                             code.includes("let ") ||
                             code.includes("var ");

        if (!hasJavaScript) return false;
        if (generationComplete) return true;

        const scriptTagsCount = (code.match(/<script/g) || []).length;
        const closingScriptTagsCount = (code.match(/<\/script>/g) || []).length;

        return scriptTagsCount === closingScriptTagsCount &&
               !code.trim().endsWith("function") &&
               !code.trim().endsWith("{") &&
               !code.trim().endsWith(";");
      },
      completed: false,
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "finalize",
      label: "Finalizing masterpiece...",
      icon: Settings,
      detector: () => generationComplete,
      completed: false,
      color: "from-emerald-500 to-green-500"
    }
  ]);

  const currentStepIndex = steps.findIndex(step => !step.completed);

  useEffect(() => {
    if (generatedCode) {
      const updatedSteps = steps.map(step => ({
        ...step,
        completed: step.detector(generatedCode)
      }));
      setSteps(updatedSteps);
    }

    if (generationComplete) {
      const completedSteps = steps.map(step => ({
        ...step,
        completed: true
      }));
      setSteps(completedSteps);
    }
  }, [generatedCode, generationComplete]);

  return (
    <div className="space-y-3 h-full overflow-y-auto">
      {steps.map((step, index) => {
        const isCompleted = step.completed;
        const isCurrent = !isCompleted && (currentStepIndex === -1 || index === currentStepIndex);
        const Icon = step.icon;

        return (
          <div 
            key={step.id} 
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
              isCurrent 
                ? 'glass border border-purple-500/30 scale-105' 
                : isCompleted 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'opacity-60'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isCompleted 
                ? 'bg-green-500' 
                : isCurrent && isGenerating 
                  ? `bg-gradient-to-br ${step.color}` 
                  : 'bg-gray-700'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : isCurrent && isGenerating ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Icon className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <span className={`text-sm font-medium ${
                isCompleted
                  ? "text-green-400"
                  : isCurrent
                    ? "text-white"
                    : "text-gray-500"
              }`}>
                {step.label}
              </span>
              
              {isCurrent && isGenerating && (
                <div className="mt-1">
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${step.color} rounded-full animate-pulse`} 
                         style={{ width: '60%' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
}