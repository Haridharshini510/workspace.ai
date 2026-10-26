const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const DEFAULT_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

function getModelChain(): string[] {
  const envModels = process.env.OPENROUTER_MODELS;
  if (envModels) {
    return envModels.split(",").map((m) => m.trim()).filter(Boolean);
  }
  return DEFAULT_MODELS;
}

interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LlmOptions {
  temperature?: number;
  maxTokens?: number;
}

interface LlmResponse {
  content: string;
  model: string;
  usage: { promptTokens: number; completionTokens: number };
}

async function tryModel(
  model: string,
  apiKey: string,
  messages: LlmMessage[],
  options: LlmOptions
): Promise<LlmResponse> {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.1,
      max_tokens: options.maxTokens ?? 512,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Model ${model} failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  const choice = data.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error(`Model ${model} returned no content`);
  }

  return {
    content: choice.message.content,
    model: data.model || model,
    usage: {
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
    },
  };
}

export async function callLlm(
  messages: LlmMessage[],
  options: LlmOptions = {}
): Promise<LlmResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const models = getModelChain();
  const errors: string[] = [];

  for (const model of models) {
    try {
      const result = await tryModel(model, apiKey, messages, options);
      return result;
    } catch (error: any) {
      errors.push(error.message);
      console.warn(`Fallback: ${model} failed, trying next model...`);
    }
  }

  throw new Error(`All models failed:\n${errors.join("\n")}`);
}
