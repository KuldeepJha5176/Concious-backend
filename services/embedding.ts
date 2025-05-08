import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Constants
export const VECTOR_DIMENSION = 768; // Gemini embedding-001 outputs 768-dimension vectors

export async function getEmbedding(text: string): Promise<number[]> {
  const MAX_EMBEDDING_SIZE = 30000; // Conservative limit in bytes
  
  try {
    // Process the text if needed
    let processedText = text;
    if (text.length > MAX_EMBEDDING_SIZE) {
      // For larger text, summarize it first
      try {
        // Aggressive summarization using the model
        const summary = await model.generateContent({
          contents: [{
            role: "user",
            parts: [{
              text: `Create a concise summary (under 5000 characters) that captures the essential meaning and key concepts of this text. Focus on the most important ideas only: ${text.substring(0, 25000)}...`
            }]
          }]
        });
        
        processedText = summary.response?.text() || "";
        
        // If summary is still too long, truncate it
        if (processedText.length > MAX_EMBEDDING_SIZE) {
          processedText = processedText.substring(0, MAX_EMBEDDING_SIZE);
        }
      } catch (summaryError) {
        console.error("Summarization failed:", summaryError);
        // Fallback to simple truncation
        processedText = text.substring(0, MAX_EMBEDDING_SIZE);
      }
    }
    
    // Get embedding
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await embeddingModel.embedContent(processedText);
    
    let embeddings: number[] = [];
    
    if (result.embedding && typeof result.embedding === "object") {
      if ("values" in result.embedding && Array.isArray(result.embedding.values)) {
        embeddings = result.embedding.values;
      } else if (Array.isArray(result.embedding)) {
        embeddings = result.embedding;
      } else {
        throw new Error("Unexpected embedding format");
      }
    } else {
      throw new Error("Failed to get valid embedding");
    }
    
    // Verify the dimension
    if (embeddings.length !== VECTOR_DIMENSION) {
      console.warn(`Warning: Embedding dimension ${embeddings.length} does not match expected dimension ${VECTOR_DIMENSION}`);
    }
    
    return embeddings;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error(`Embedding generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}