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

    // Validate provider configuration before creating client
    if (provider === LLMProvider.DEEPSEEK && !process.env.DEEPSEEK_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'DeepSeek API key is not configured. Please set DEEPSEEK_API_KEY in your environment variables.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (provider === LLMProvider.OPENAI_COMPATIBLE && !process.env.OPENAI_COMPATIBLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI Compatible API key is not configured. Please set OPENAI_COMPATIBLE_API_KEY in your environment variables.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
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