// Defines the available LLM providers
export enum LLMProvider {
  DEEPSEEK = 'deepseek',
  OPENAI_COMPATIBLE = 'openai_compatible',
  OLLAMA = 'ollama',
  LM_STUDIO = 'lm_studio',
  OPENROUTER = 'openrouter',
  GEMINI = 'gemini',
}

// Provider configuration interface
export interface ProviderConfig {
  id: LLMProvider;
  name: string;
  description: string;
  baseUrlEnvVar: string;
  apiKeyEnvVar: string | null; // Null if no API key is required
  defaultBaseUrl: string;
  logoUrl?: string;
  isLocal: boolean;
  examples?: string[]; // Examples of compatible services
}

// Configurations for supported providers
export const PROVIDER_CONFIGS: Record<LLMProvider, ProviderConfig> = {
  [LLMProvider.DEEPSEEK]: {
    id: LLMProvider.DEEPSEEK,
    name: 'DeepSeek',
    description: 'AI models from DeepSeek',
    baseUrlEnvVar: 'DEEPSEEK_API_BASE',
    apiKeyEnvVar: 'DEEPSEEK_API_KEY',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    isLocal: false,
  },
  [LLMProvider.OPENAI_COMPATIBLE]: {
    id: LLMProvider.OPENAI_COMPATIBLE,
    name: 'Custom API',
    description: 'Configure your own OpenAI-compatible API',
    baseUrlEnvVar: 'OPENAI_COMPATIBLE_API_BASE',
    apiKeyEnvVar: 'OPENAI_COMPATIBLE_API_KEY',
    defaultBaseUrl: 'https://api.openai.com/v1',
    isLocal: false,
    examples: ['OpenAI', 'Together AI', 'Anyscale', 'Groq', 'Claude AI', 'Anthropic'],
  },
  [LLMProvider.OLLAMA]: {
    id: LLMProvider.OLLAMA,
    name: 'Ollama',
    description: 'Local AI models with Ollama',
    baseUrlEnvVar: 'OLLAMA_API_BASE',
    apiKeyEnvVar: null, // Ollama doesn't require an API key
    defaultBaseUrl: 'http://localhost:11434',
    isLocal: true,
  },
  [LLMProvider.LM_STUDIO]: {
    id: LLMProvider.LM_STUDIO,
    name: 'LM Studio',
    description: 'Local AI models with LM Studio',
    baseUrlEnvVar: 'LM_STUDIO_API_BASE',
    apiKeyEnvVar: null, // LM Studio doesn't require an API key
    defaultBaseUrl: 'http://localhost:1234/v1',
    isLocal: true,
  },
  [LLMProvider.OPENROUTER]: {
    id: LLMProvider.OPENROUTER,
    name: 'OpenRouter',
    description: 'OpenRouter API (unifică mai multe LLM-uri)',
    baseUrlEnvVar: 'OPENROUTER_API_BASE',
    apiKeyEnvVar: 'OPENROUTER_API_KEY',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    isLocal: false,
    examples: ['OpenRouter'],
  },
  [LLMProvider.GEMINI]: {
    id: LLMProvider.GEMINI,
    name: 'Google Gemini',
    description: 'Google Gemini AI models',
    baseUrlEnvVar: 'GEMINI_API_BASE',
    apiKeyEnvVar: 'GEMINI_API_KEY',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    isLocal: false,
    examples: ['Gemini 2.0 Flash', 'Gemini Pro', 'Gemini Ultra'],
  },
};

// Helper function to get a provider's configuration
export function getProviderConfig(provider: LLMProvider): ProviderConfig {
  return PROVIDER_CONFIGS[provider];
}

// Helper function to get a provider's base URL
export function getProviderBaseUrl(provider: LLMProvider): string {
  const config = getProviderConfig(provider);
  return process.env[config.baseUrlEnvVar] || config.defaultBaseUrl;
}

// Helper function to get a provider's API key
export function getProviderApiKey(provider: LLMProvider): string | null {
  const config = getProviderConfig(provider);
  if (!config.apiKeyEnvVar) return null;
  return process.env[config.apiKeyEnvVar] || null;
}

// List of all available providers
export function getAvailableProviders(): ProviderConfig[] {
  return Object.values(PROVIDER_CONFIGS);
}