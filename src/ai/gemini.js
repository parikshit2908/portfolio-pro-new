// src/ai/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Safety check
if (!apiKey) {
  console.error("❌ Missing Gemini API Key. Add VITE_GEMINI_API_KEY to your .env file.");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(apiKey);

// Required export for AskAI.jsx
export const gemini = genAI.getGenerativeModel({
  model: "gemini-pro",
});

export default gemini;
