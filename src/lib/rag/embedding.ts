const EMBEDDING_DIMENSION = 1536;

export async function createEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return createPlaceholderEmbedding(text);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error("Error creating embedding:", error);
    return createPlaceholderEmbedding(text);
  }
}

function createPlaceholderEmbedding(text: string): number[] {
  const hash = hashString(text);
  const embedding = new Array(EMBEDDING_DIMENSION);
  
  for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
    embedding[i] = ((hash * (i + 1)) % 1000) / 1000 - 0.5;
  }
  
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);
  
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(" "));
    start = end - overlap;
    
    if (start >= words.length) break;
  }
  
  return chunks;
}
