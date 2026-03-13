import { createClient as createServerClient } from "@/supabase/server";
import { createEmbedding, chunkText } from "./embedding";
import type { CurriculumDoc } from "@/supabase/types";

export interface DocumentChunk {
  id: string;
  title: string;
  content: string;
  similarity: number;
}

export async function storeDocument(
  userId: string,
  title: string,
  content: string,
  metadata: Record<string, unknown> = {}
): Promise<string> {
  const supabase = await createServerClient();
  
  const chunks = chunkText(content);
  const embeddings = await Promise.all(
    chunks.map(chunk => createEmbedding(chunk))
  );

  const combinedContent = chunks.join("\n\n");
  const combinedEmbedding = averageArrays(embeddings);

  const { data, error } = await supabase
    .from("curriculum_docs")
    .insert({
      user_id: userId,
      title,
      content: combinedContent,
      embedding: combinedEmbedding,
      metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function searchDocuments(
  query: string,
  matchThreshold: number = 0.7,
  matchCount: number = 5
): Promise<DocumentChunk[]> {
  const supabase = await createServerClient();
  
  const queryEmbedding = await createEmbedding(query);

  const { data, error } = await supabase.rpc("match_curriculum_docs", {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) throw error;
  return data || [];
}

export async function getUserDocuments(userId: string): Promise<CurriculumDoc[]> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from("curriculum_docs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteDocument(docId: string, userId: string): Promise<void> {
  const supabase = await createServerClient();
  
  const { error } = await supabase
    .from("curriculum_docs")
    .delete()
    .eq("id", docId)
    .eq("user_id", userId);

  if (error) throw error;
}

function averageArrays(arrays: number[][]): number[] {
  const dimension = arrays[0].length;
  const result = new Array(dimension).fill(0);
  
  for (const arr of arrays) {
    for (let i = 0; i < dimension; i++) {
      result[i] += arr[i];
    }
  }
  
  return result.map(val => val / arrays.length);
}
