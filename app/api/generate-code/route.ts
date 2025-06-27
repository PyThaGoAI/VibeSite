import { NextRequest } from 'next/server';
import { LLMProvider } from '@/lib/providers/config';
import { createProviderClient } from '@/lib/providers/provider';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const { prompt, model, provider: providerParam, customSystemPrompt, maxTokens } = await request.json();

    // Check if prompt and model are provided
    if (!prompt || !model) {
      return new Response(
        JSON.stringify({ error: 'Prompt and model are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse maxTokens as a number if it's provided
    const parsedMaxTokens = maxTokens ? parseInt(maxTokens.toString(), 10) : undefined;

    // Determine the provider to use
    let provider: LLMProvider;

    if (providerParam && Object.values(LLMProvider).includes(providerParam as LLMProvider)) {
      provider = providerParam as LLMProvider;
    } else {
      // Use the default provider from environment variables or DeepSeek as fallback
      provider = (process.env.DEFAULT_PROVIDER as LLMProvider) || LLMProvider.DEEPSEEK;
    }

    // Validare chei și endpointuri pentru fiecare provider popular
    const providerEnvChecks: Record<string, { key?: string; base?: string; }> = {
      [LLMProvider.DEEPSEEK]: { key: process.env.DEEPSEEK_API_KEY, base: process.env.DEEPSEEK_API_BASE },
      [LLMProvider.OPENAI]: { key: process.env.OPENAI_API_KEY, base: process.env.OPENAI_API_BASE },
      [LLMProvider.OPENAI_COMPATIBLE]: { key: process.env.OPENAI_COMPATIBLE_API_KEY, base: process.env.OPENAI_COMPATIBLE_BASE_URL },
      [LLMProvider.ANTHROPIC]: { key: process.env.ANTHROPIC_API_KEY, base: process.env.ANTHROPIC_API_BASE },
      [LLMProvider.GROQ]: { key: process.env.GROQ_API_KEY, base: process.env.GROQ_API_BASE },
      [LLMProvider.TOGETHER]: { key: process.env.TOGETHER_API_KEY, base: process.env.TOGETHER_API_BASE },
      [LLMProvider.OLLAMA]: { base: process.env.OLLAMA_API_BASE },
      [LLMProvider.LM_STUDIO]: { base: process.env.LM_STUDIO_API_BASE },
      [LLMProvider.MISTRAL]: { key: process.env.MISTRAL_API_KEY, base: process.env.MISTRAL_API_BASE },
      [LLMProvider.COHERE]: { key: process.env.COHERE_API_KEY, base: process.env.COHERE_API_BASE },
      [LLMProvider.GEMINI]: { key: process.env.GEMINI_API_KEY, base: process.env.GEMINI_API_BASE },
      [LLMProvider.LAMINI]: { key: process.env.LAMINI_API_KEY, base: process.env.LAMINI_API_BASE },
      [LLMProvider.CUSTOM]: { key: process.env.CUSTOM_LLM_API_KEY, base: process.env.CUSTOM_LLM_API_BASE },
    };

    const envCheck = providerEnvChecks[provider];
    if (envCheck) {
      if (envCheck.key !== undefined && !envCheck.key) {
        return new Response(
          JSON.stringify({ error: `Cheia API pentru providerul '${provider}' nu este configurată. Te rugăm să setezi variabila corespunzătoare în .env.local (ex: ${Object.keys(envCheck).find(k => k === 'key')?.toUpperCase()})` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (envCheck.base !== undefined && !envCheck.base) {
        return new Response(
          JSON.stringify({ error: `Endpointul (BASE URL) pentru providerul '${provider}' nu este configurat. Te rugăm să setezi variabila corespunzătoare în .env.local (ex: ${Object.keys(envCheck).find(k => k === 'base')?.toUpperCase()})` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create the provider client
    const providerClient = createProviderClient(provider);

    // Generate code with the selected provider and custom system prompt if provided
    const stream = await providerClient.generateCode(prompt, model, customSystemPrompt || null, parsedMaxTokens);

    // Return the stream as response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating code:', error);

    // Return a more specific error message if available
    let errorMessage = 'Error generating code';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific authentication errors
      if (error.message.includes('401') || error.message.includes('No auth credentials')) {
        errorMessage = 'Authentication failed. Please check your API key configuration.';
      }
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}