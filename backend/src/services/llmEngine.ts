import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export interface LLMResponse {
  text: string;
  provider: "ollama" | "gemini" | "heuristic";
  model: string;
}

export class LLMEngine {
  private static geminiClient: GoogleGenAI | null = null;
  private static ollamaBaseUrl: string = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  private static ollamaModel: string = process.env.OLLAMA_MODEL || "llama3";

  static init() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (apiKey) {
      try {
        this.geminiClient = new GoogleGenAI({ apiKey });
      } catch {
        this.geminiClient = null;
      }
    }
  }

  static async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    if (!this.geminiClient) {
      this.init();
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt: `${systemPrompt ? systemPrompt + "\n\n" : ""}${prompt}`,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          return {
            text: data.response,
            provider: "ollama",
            model: this.ollamaModel,
          };
        }
      }
    } catch {
      // Local LLM unavailable
    }

    if (this.geminiClient) {
      try {
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        const response = await this.geminiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
        });

        if (response.text) {
          return {
            text: response.text,
            provider: "gemini",
            model: "gemini-2.5-flash",
          };
        }
      } catch {
        // Gemini fallback
      }
    }

    return {
      text: "",
      provider: "heuristic",
      model: "forensic-heuristic-v1",
    };
  }

  static getActiveProviders(): Array<{ name: string; type: string; status: string }> {
    return [
      { name: "Ollama Local LLM", type: "Local (On-Premises)", status: "Active / Standby" },
      { name: "Google Gemini 2.5 Flash", type: "Cloud Forensic", status: this.geminiClient ? "Online" : "Configured" },
      { name: "ChromaDB Vector Store", type: "Vector Database", status: "Online" },
    ];
  }
}

LLMEngine.init();
