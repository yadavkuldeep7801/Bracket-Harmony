
import { GoogleGenAI } from "@google/genai";
import { AlgorithmMode } from "../types";

export const getExplanation = async (input: string, isValid: boolean, mode: AlgorithmMode) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Explain why the string "${input}" is ${isValid ? 'VALID' : 'INVALID'} when processed using a ${mode.toUpperCase()} (${mode === 'stack' ? 'Last-In First-Out' : 'First-In First-Out'}) data structure.
    
    The problem is "Valid Parentheses":
    - Open brackets must be closed by the same type of brackets.
    - Open brackets must be closed in the correct order.
    
    Crucially, note that while a Stack is the standard solution, a Queue behaves differently. 
    Explain if the ${mode} logic successfully handles nesting or if it fails because of its FIFO/LIFO nature.
    
    Provide a concise, friendly, and educational explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to fetch AI explanation. Please check your internet connection or try again later.";
  }
};
