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
      // Use the default provider from environment variables or Gemini as fallback
      provider = (process.env.DEFAULT_PROVIDER as LLMProvider) || LLMProvider.GEMINI;
    }

    console.log(`[DEBUG] Using provider: ${provider}`);

    // Validate provider configuration before creating client
    const providerEnvChecks: Record<string, { key?: string; base?: string; keyEnvVar?: string; baseEnvVar?: string; }> = {
      [LLMProvider.GEMINI]: { 
        key: process.env.GEMINI_API_KEY, 
        base: process.env.GEMINI_API_BASE,
        keyEnvVar: 'GEMINI_API_KEY',
        baseEnvVar: 'GEMINI_API_BASE'
      },
      [LLMProvider.DEEPSEEK]: { 
        key: process.env.DEEPSEEK_API_KEY, 
        base: process.env.DEEPSEEK_API_BASE,
        keyEnvVar: 'DEEPSEEK_API_KEY',
        baseEnvVar: 'DEEPSEEK_API_BASE'
      },
      [LLMProvider.OPENAI_COMPATIBLE]: { 
        key: process.env.OPENAI_COMPATIBLE_API_KEY, 
        base: process.env.OPENAI_COMPATIBLE_BASE_URL,
        keyEnvVar: 'OPENAI_COMPATIBLE_API_KEY',
        baseEnvVar: 'OPENAI_COMPATIBLE_BASE_URL'
      },
      [LLMProvider.OLLAMA]: { 
        base: process.env.OLLAMA_API_BASE,
        baseEnvVar: 'OLLAMA_API_BASE'
      },
      [LLMProvider.LM_STUDIO]: { 
        base: process.env.LM_STUDIO_API_BASE,
        baseEnvVar: 'LM_STUDIO_API_BASE'
      },
      [LLMProvider.CUSTOM]: { 
        key: process.env.CUSTOM_LLM_API_KEY, 
        base: process.env.CUSTOM_LLM_API_BASE,
        keyEnvVar: 'CUSTOM_LLM_API_KEY',
        baseEnvVar: 'CUSTOM_LLM_API_BASE'
      },
    };

    const envCheck = providerEnvChecks[provider];
    if (envCheck) {
      // Check API key for providers that require it
      if (envCheck.key !== undefined && (!envCheck.key || envCheck.key.includes('your_') || envCheck.key.includes('_here'))) {
        return new Response(
          JSON.stringify({ 
            error: `API key for provider '${provider}' is not properly configured. Please set a valid ${envCheck.keyEnvVar} in your .env.local file.` 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check base URL for providers that require it
      if (envCheck.base !== undefined && !envCheck.base) {
        return new Response(
          JSON.stringify({ 
            error: `Base URL for provider '${provider}' is not configured. Please set ${envCheck.baseEnvVar} in your .env.local file.` 
          }),
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
      
      // Handle Gemini-specific errors
      if (error.message.includes('Gemini') && error.message.includes('API key')) {
        errorMessage = 'Google Gemini API key is not properly configured. Please set a valid GEMINI_API_KEY in your .env.local file.';
      }
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}