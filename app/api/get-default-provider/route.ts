import { NextResponse } from 'next/server';
import { LLMProvider } from '@/lib/providers/config';

export async function GET() {
  try {
    // Get the default provider from environment variables with proper fallback
    const envDefaultProvider = process.env.DEFAULT_PROVIDER;
    
    // Validate that the provider exists in our enum
    let defaultProvider: LLMProvider;
    
    if (envDefaultProvider && Object.values(LLMProvider).includes(envDefaultProvider as LLMProvider)) {
      defaultProvider = envDefaultProvider as LLMProvider;
    } else {
      // Fallback to LM Studio instead of Gemini to avoid API key issues
      defaultProvider = LLMProvider.LM_STUDIO;
      console.warn(`[DEFAULT_PROVIDER] Invalid or missing DEFAULT_PROVIDER: "${envDefaultProvider}". Falling back to: ${defaultProvider}`);
    }

    console.log(`[DEFAULT_PROVIDER] Using provider: ${defaultProvider}`);

    return NextResponse.json({ defaultProvider });
  } catch (error) {
    console.error('Error fetching default provider:', error);

    // Return LM Studio as fallback instead of Gemini
    return NextResponse.json({ defaultProvider: LLMProvider.LM_STUDIO });
  }
}