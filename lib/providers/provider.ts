import OpenAI from 'openai';
import { LLMProvider, getProviderApiKey, getProviderBaseUrl } from './config';

// Shared system prompt for all providers
export const SYSTEM_PROMPT = "You are an expert web developer AI. Your task is to generate a single, self-contained HTML file based on the user's prompt. This HTML file must include all necessary HTML structure, CSS styles within <style> tags in the <head>, and JavaScript code within <script> tags, preferably at the end of the <body>. IMPORTANT: Do NOT use markdown formatting. Do NOT wrap the code in ```html and ``` tags. Do NOT output any text or explanation before or after the HTML code. Only output the raw HTML code itself, starting with <!DOCTYPE html> and ending with </html>. Ensure the generated CSS and JavaScript are directly embedded in the HTML file.";

// Common interface for all providers
export interface LLMProviderClient {
  getModels: () => Promise<{ id: string; name: string }[]>;
  generateCode: (prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) => Promise<ReadableStream<Uint8Array>>;
}

// Factory function to create a provider client
export function createProviderClient(provider: LLMProvider): LLMProviderClient {
  switch (provider) {
    case LLMProvider.DEEPSEEK:
      return new OpenAICompatibleProvider(LLMProvider.DEEPSEEK);
    case LLMProvider.OPENAI_COMPATIBLE:
      return new OpenAICompatibleProvider(LLMProvider.OPENAI_COMPATIBLE);
    case LLMProvider.OLLAMA:
      return new OllamaProvider();
    case LLMProvider.LM_STUDIO:
      return new LMStudioProvider();
    case LLMProvider.OPENROUTER: {
      // DEBUG: loghează cheia și endpointul folosite pentru OpenRouter
      const apiKey = getProviderApiKey(LLMProvider.OPENROUTER);
      const baseURL = getProviderBaseUrl(LLMProvider.OPENROUTER);
      console.log('[DEBUG][OPENROUTER] API KEY:', apiKey);
      console.log('[DEBUG][OPENROUTER] BASE URL:', baseURL);
      return new OpenAICompatibleProvider(LLMProvider.OPENROUTER);
    }
    case LLMProvider.GEMINI:
      return new GeminiProvider();
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// OpenAI-compatible provider (OpenAI, Kluster.ai, Mistral, etc.)
class OpenAICompatibleProvider implements LLMProviderClient {
  private client: OpenAI;
  private provider: LLMProvider;

  constructor(provider: LLMProvider) {
    this.provider = provider;
    const apiKey = getProviderApiKey(provider);
    const baseURL = getProviderBaseUrl(provider);
    
    // Validate API key exists for cloud providers
    if (!apiKey) {
      throw new Error(`API key not found for provider ${provider}. Please configure the appropriate environment variable.`);
    }

    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
    });
  }

  async getModels() {
    try {
      const response = await this.client.models.list();

      // Remove duplicates based on model ID
      const uniqueModels = Array.from(
        new Map(response.data.map(model => [model.id, model])).values()
      );

      return uniqueModels.map((model) => ({
        id: model.id,
        name: model.id,
      }));
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error(`Authentication failed for ${this.provider}. Please check your API key.`);
      }
      throw error;
    }
  }

  async generateCode(prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) {
    // Use custom system prompt if provided, otherwise use default
    const systemPromptToUse = customSystemPrompt || SYSTEM_PROMPT;

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPromptToUse },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens || undefined, // Use maxTokens if provided, otherwise let the API decide
        stream: true,
      });

      // Create a ReadableStream for the response
      const textEncoder = new TextEncoder();
      return new ReadableStream({
        async start(controller) {
          try {
            // Process the stream from OpenAI
            for await (const chunk of stream) {
              // Extract the text from the chunk
              const content = chunk.choices[0]?.delta?.content || '';

              // Send the text to the client
              controller.enqueue(textEncoder.encode(content));
            }
            controller.close();
          } catch (error) {
            console.error('Error in stream processing:', error);
            controller.error(error);
          }
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error(`Authentication failed for ${this.provider}. Please check your API key.`);
      }
      throw error;
    }
  }
}

// Google Gemini Provider implementation
class GeminiProvider implements LLMProviderClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = getProviderApiKey(LLMProvider.GEMINI) || '';
    this.baseUrl = getProviderBaseUrl(LLMProvider.GEMINI) || '';
    
    if (!this.apiKey) {
      throw new Error('Google Gemini API key not found. Please configure GEMINI_API_KEY in your environment variables.');
    }
  }

  async getModels() {
    try {
      const response = await fetch(`${this.baseUrl}/models?key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching Gemini models: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Filter only generative models that support generateContent
      const generativeModels = data.models?.filter((model: any) => 
        model.supportedGenerationMethods?.includes('generateContent') &&
        model.name.includes('gemini')
      ) || [];

      return generativeModels.map((model: any) => ({
        id: model.name.replace('models/', ''), // Remove 'models/' prefix
        name: model.displayName || model.name.replace('models/', ''),
      }));
    } catch (error) {
      console.error('Error fetching Gemini models:', error);
      // Return default models if API call fails
      return [
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
      ];
    }
  }

  async generateCode(prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) {
    const systemPromptToUse = customSystemPrompt || SYSTEM_PROMPT;
    
    try {
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${systemPromptToUse}\n\nUser request: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: maxTokens || 8192,
          temperature: 0.7,
        }
      };

      const response = await fetch(
        `${this.baseUrl}/models/${model}:streamGenerateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Error generating code with Gemini: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response received from Gemini API');
      }

      // Create a ReadableStream for the response
      const textEncoder = new TextEncoder();
      return new ReadableStream({
        async start(controller) {
          const reader = response.body!.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                controller.close();
                break;
              }

              // Convert the chunk to text
              const chunk = new TextDecoder().decode(value);

              try {
                // Gemini returns JSON objects separated by line breaks
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                  if (line.trim()) {
                    const data = JSON.parse(line);
                    
                    // Extract text from Gemini response structure
                    if (data.candidates && data.candidates[0]?.content?.parts) {
                      const text = data.candidates[0].content.parts
                        .map((part: any) => part.text || '')
                        .join('');
                      
                      if (text) {
                        controller.enqueue(textEncoder.encode(text));
                      }
                    }
                  }
                }
              } catch (e) {
                // If parsing fails, try to extract any text content
                const textMatch = chunk.match(/"text":\s*"([^"]+)"/g);
                if (textMatch) {
                  textMatch.forEach(match => {
                    const text = match.replace(/"text":\s*"/, '').replace(/"$/, '');
                    controller.enqueue(textEncoder.encode(text));
                  });
                }
              }
            }
          } catch (error) {
            console.error('Error reading Gemini stream:', error);
            controller.error(error);
          }
        }
      });
    } catch (error) {
      console.error('Error generating code with Gemini:', error);
      throw error;
    }
  }
}

// Ollama Provider implementation
class OllamaProvider implements LLMProviderClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getProviderBaseUrl(LLMProvider.OLLAMA);
  }

  async getModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Error fetching Ollama models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models ? data.models.map((model: any) => ({
        id: model.name,
        name: model.name,
      })) : [];
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      throw new Error('Cannot connect to Ollama. Is the server running?');
    }
  }

  async generateCode(prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) {
    // Use custom system prompt if provided, otherwise use default
    const systemPromptToUse = customSystemPrompt || SYSTEM_PROMPT;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: `${systemPromptToUse}\n\nUser request: ${prompt}`,
          stream: true,
          options: maxTokens ? { num_predict: maxTokens } : undefined, // Ollama uses num_predict for max tokens
        }),
      });

      if (!response.ok) {
        throw new Error(`Error generating code with Ollama: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response received from Ollama server');
      }

      // Create a ReadableStream for the response
      const textEncoder = new TextEncoder();
      return new ReadableStream({
        async start(controller) {
          const reader = response.body!.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                controller.close();
                break;
              }

              // Convert the chunk to text
              const chunk = new TextDecoder().decode(value);

              try {
                // Ollama returns JSON objects separated by line breaks
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                  const data = JSON.parse(line);
                  if (data.response) {
                    controller.enqueue(textEncoder.encode(data.response));
                  }
                }
              } catch (e) {
                // If parsing fails, send the raw text
                controller.enqueue(textEncoder.encode(chunk));
              }
            }
          } catch (error) {
            console.error('Error reading Ollama stream:', error);
            controller.error(error);
          }
        }
      });
    } catch (error) {
      console.error('Error generating code with Ollama:', error);
      throw error;
    }
  }
}

// LM Studio Provider implementation
class LMStudioProvider implements LLMProviderClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: 'lm-studio', // LM Studio accepts any API key
      baseURL: getProviderBaseUrl(LLMProvider.LM_STUDIO),
    });
  }

  async getModels() {
    try {
      const response = await this.client.models.list();
      return response.data.map((model) => ({
        id: model.id,
        name: model.id,
      }));
    } catch (error) {
      console.error('Error fetching LM Studio models:', error);
      throw new Error('Cannot connect to LM Studio. Is the server running?');
    }
  }

  async generateCode(prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) {
    // Use custom system prompt if provided, otherwise use default
    const systemPromptToUse = customSystemPrompt || SYSTEM_PROMPT;

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPromptToUse },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens || undefined, // Use maxTokens if provided, otherwise let the API decide
        stream: true,
      });

      // Create a ReadableStream for the response
      const textEncoder = new TextEncoder();
      return new ReadableStream({
        async start(controller) {
          try {
            // Process the stream from OpenAI
            for await (const chunk of stream) {
              // Extract the text from the chunk
              const content = chunk.choices[0]?.delta?.content || '';

              // Send the text to the client
              controller.enqueue(textEncoder.encode(content));
            }
            controller.close();
          } catch (error) {
            console.error('Error in LM Studio stream processing:', error);
            controller.error(error);
          }
        },
      });
    } catch (error) {
      console.error('Error generating code with LM Studio:', error);
      throw error;
    }
  }
}