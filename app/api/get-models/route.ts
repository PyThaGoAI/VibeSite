import { NextRequest, NextResponse } from 'next/server';
import { createProviderClient } from '@/lib/providers/provider';

const OPENROUTER_PROVIDER = 'openrouter';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Cheia API pentru OpenRouter nu este configurată." },
        { status: 400 }
      );
    }

    const providerClient = createProviderClient(OPENROUTER_PROVIDER);
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
