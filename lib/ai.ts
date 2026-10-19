import OpenAI from "openai";

export const aiClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const AI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";