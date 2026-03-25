import { ChatGroq } from "@langchain/groq";
import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "qwen/qwen3-32b",
  temperature: 0.2,
});


export const auditFullProject = async (projectContext: string) => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile", // Use the 70B model for complex multi-file reasoning
    temperature: 0.1,
  });

  const prompt = `
    ACT AS: A Principal Software Architect & Security Lead.
    TASK: Perform a FULL SYSTEM AUDIT on the provided Expo project files.
    
    PROJECT FILES:
    ${projectContext}
    
    AUDIT CRITERIA:
    1. AUTH FLOW: Does the Navigation logic properly respect the AuthProvider state?
    2. TOKEN STORAGE: Is sensitive data (tokens/user info) leaked in any 'pages' via AsyncStorage?
    3. PROVIDER HELL: Is the RootProvider wrapping components in the correct order?
    4. NAVIGATION GUARD: Check if protected routes in 'navigation/' actually prevent access before rendering pages.
    
    OUTPUT: A comprehensive Markdown report including "Critical Architectural Risks" and "Modernization Roadmap".
  `;

  const response = await model.invoke(prompt);
  return response.content;
};
/**
 * applyUpgrade
 * This function takes the Audit Report and the legacy code, 
 * then generates a modernized, secure version of the file.
 */
export const applyUpgrade = async (currentCode: string, auditReport: string) => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0, // 0 ensures deterministic, non-creative code generation
  });

  const prompt = `
    ACT AS: A Lead Software Architect & Security Expert.
    TASK: Refactor the provided AuthProvider and other pages code based on the Audit Report findings.
    
    GUIDELINES:
    1. Resolve all security vulnerabilities mentioned in the report.
    2. Implement 2026 Expo standards: Use 'expo-secure-store' instead of AsyncStorage.
    3. Shift logic to 'Expo API Routes' architecture where applicable.
    4. Ensure full TypeScript type-safety (Interfaces, Types).
    5. Maintain the existing context naming conventions so the rest of the app doesn't break.
    
    AUDIT REPORT:
    ${auditReport}
    
    CURRENT CODE:
    ${currentCode}
    
    OUTPUT: Return ONLY the updated TypeScript code. Do not include any conversational text or markdown blocks.
  `;

  const response = await model.invoke(prompt);
  return response.content;
};