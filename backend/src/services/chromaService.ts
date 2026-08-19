import { ChromaClient } from "chromadb";

export interface VectorDocument {
  id: string;
  caseId: string;
  title: string;
  content: string;
  type: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}

export class ChromaVectorService {
  private static client: ChromaClient | null = null;
  private static inMemoryStore: Map<string, VectorDocument> = new Map();
  private static chromaUrl = process.env.CHROMA_URL || "http://localhost:8000";

  static async init() {
    try {
      this.client = new ChromaClient({ path: this.chromaUrl });
    } catch {
      this.client = null;
    }
  }

  private static generateMockEmbedding(text: string): number[] {
    const vector = new Array(384).fill(0);
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      vector[i % 384] += (code % 31) / 31;
    }
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map((val) => val / magnitude);
  }

  private static cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  static async indexDocument(doc: VectorDocument): Promise<{ success: boolean; id: string }> {
    const embedding = doc.embedding || this.generateMockEmbedding(doc.content);
    const enrichedDoc: VectorDocument = {
      ...doc,
      embedding,
    };

    this.inMemoryStore.set(doc.id, enrichedDoc);

    if (this.client) {
      try {
        const collection = await this.client.getOrCreateCollection({ name: `intelboard_cases` });
        await collection.upsert({
          ids: [doc.id],
          embeddings: [embedding],
          metadatas: [{ caseId: doc.caseId, title: doc.title, type: doc.type }],
          documents: [doc.content],
        });
      } catch {
        // Fallback to in-memory store
      }
    }

    return { success: true, id: doc.id };
  }

  static async querySimilarity(query: string, caseId?: string, topK: number = 5): Promise<Array<{ document: VectorDocument; score: number }>> {
    const queryVec = this.generateMockEmbedding(query);
    const results: Array<{ document: VectorDocument; score: number }> = [];

    for (const doc of this.inMemoryStore.values()) {
      if (caseId && doc.caseId !== caseId) {
        continue;
      }
      const score = this.cosineSimilarity(queryVec, doc.embedding || this.generateMockEmbedding(doc.content));
      results.push({
        document: doc,
        score: Math.round(Math.max(0, Math.min(1, score)) * 100),
      });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }
}

ChromaVectorService.init();
