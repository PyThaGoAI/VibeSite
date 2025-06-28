import { NextRequest, NextResponse } from 'next/server';
import { createProviderClient } from '@/lib/providers/provider';
import { LLMProvider } from '@/lib/providers/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as LLMProvider;

    if (!provider) {
      return NextResponse.json(
        { error: "Provider parameter is required" },
        { status: 400 }
      );
    }

    // Validate provider
    if (!Object.values(LLMProvider).includes(provider)) {
      return NextResponse.json(
        { error: `Unsupported provider: ${provider}` },
        { status: 400 }
      );
    }

    // Check if required environment variables are set for cloud providers
    if (provider === LLMProvider.GEMINI && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Google Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file." },
        { status: 400 }
      );
    }

    if (provider === LLMProvider.DEEPSEEK && !process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "DeepSeek API key is not configured. Please set DEEPSEEK_API_KEY in your .env.local file." },
        { status: 400 }
      );
    }

    if (provider === LLMProvider.OPENAI_COMPATIBLE && !process.env.OPENAI_COMPATIBLE_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI Compatible API key is not configured. Please set OPENAI_COMPATIBLE_API_KEY in your .env.local file." },
        { status: 400 }
      );
    }

    if (provider === LLMProvider.OPENROUTER && !process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in your .env.local file." },
        { status: 400 }
      );
    }

    if (provider === LLMProvider.CUSTOM && !process.env.CUSTOM_LLM_API_KEY) {
      return NextResponse.json(
        { error: "Custom API key is not configured. Please set CUSTOM_LLM_API_KEY in your .env.local file." },
        { status: 400 }
      );
    }

    try {
      const providerClient = createProviderClient(provider);
      const models = await providerClient.getModels();
      return NextResponse.json(models);
    } catch (providerError) {
      console.error(`Error with provider ${provider}:`, providerError);
      
      // Handle local provider connection errors gracefully
      if (provider === LLMProvider.LM_STUDIO || provider === LLMProvider.OLLAMA) {
        if (providerError instanceof Error && (
          providerError.message.includes('not running') ||
          providerError.message.includes('not accessible') ||
          providerError.message.includes('Cannot connect')
        )) {
          return NextResponse.json(
            { 
              error: providerError.message,
              isConnectionError: true,
              provider: provider
            },
            { status: 503 } // Service Unavailable
          );
        }
      }
      
      // Re-throw other errors
      throw providerError;
    }
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching models' },
      { status: 500 }
    );
  }
}