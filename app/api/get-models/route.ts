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

    // Check if required environment variables are set for the provider
    if (provider === LLMProvider.GEMINI && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Cheia API pentru Google Gemini nu este configurată. Te rugăm să setezi GEMINI_API_KEY în .env.local." },
        { status: 400 }
      );
    }

    if (provider === LLMProvider.OPENROUTER && !process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Cheia API pentru OpenRouter nu este configurată. Te rugăm să setezi OPENROUTER_API_KEY în .env.local." },
        { status: 400 }
      );
    }

    if (provider === LLMProvider.DEEPSEEK && !process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "Cheia API pentru DeepSeek nu este configurată. Te rugăm să setezi DEEPSEEK_API_KEY în .env.local." },
        { status: 400 }
      );
    }

    const providerClient = createProviderClient(provider);
    const models = await providerClient.getModels();
    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching models' },
      { status: 500 }
    );
  }
}