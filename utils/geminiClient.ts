import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateContent(prompt: string, text: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(`${prompt}\n\nContext: ${text}`);
  const response = result.response;
  const rawText = response.text();
  console.log("Raw API response:", rawText);
  
  // Remove triple backticks and any language identifier (like 'json')
  let cleanedText = rawText.replace(/^```(\w+)?\s*/, '').replace(/\s*```$/, '');
  
  // Escape special characters
  cleanedText = cleanedText.replace(/\$/g, '').replace(/\\overline/g, 'overline');
  
  // Attempt to parse and stringify to ensure valid JSON
  try {
    const parsed = JSON.parse(cleanedText);
    return JSON.stringify(parsed);
  } catch (error) {
    console.error("Failed to parse API response:", error);
    return '[]'; // Return empty array if parsing fails
  }
}