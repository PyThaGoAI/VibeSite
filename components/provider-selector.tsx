"use client"

export function ProviderSelector() {
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