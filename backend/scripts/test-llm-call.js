// Step 5 — isolated LLM call, no Express involved.
// Run with: node scripts/test-llm-call.js
// Purpose: confirm the API key works and you understand the response shape
// BEFORE tangling it up with routing logic. If this fails, the problem is
// your key/network, not your Express code — fix it here first.

require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function main() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
    console.error("Missing GEMINI_API_KEY — copy .env.example to .env and add your key.");
    process.exit(1);
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      {
        role: "user",
        parts: [{ text: "I've had a really long day and I feel kind of anxious about tomorrow." }],
      },
    ],
    config: {
      systemInstruction:
        "You are a warm, brief peer-support companion for a mental wellness app called MannMitra. Not a therapist. Keep replies short.",
    },
  });

  console.log("--- Raw response.text ---");
  console.log(response.text);
}

main().catch((err) => {
  console.error("LLM call failed:", err.message);
  process.exit(1);
});
