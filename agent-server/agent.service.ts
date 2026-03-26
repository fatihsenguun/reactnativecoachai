import { ChatGroq } from "@langchain/groq";
import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();


export const auditFileChunk = async (fileName: string, content: string) => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,

    model: "llama-3.3-70b-versatile", 
    temperature: 0.1,
  });

  const prompt = `
    ACT AS: A Senior Expo Security Auditor.
    FILE: ${fileName}
    
    TASK: Analyze this specific file for Auth, Navigation, or State management issues.
    
    CRITERIA:
    1. Insecure storage (AsyncStorage used for tokens?).
    2. Missing navigation guards/protected routes logic.
    3. Improper Context Provider usage.
    
    CODE:
    ${content}
    
    OUTPUT: List specific technical issues found in this file. If clean, reply: "No issues detected."
  `;

  const response = await model.invoke(prompt);
  return response.content;
};


export const applyUpgrade = async (currentCode: string, auditFindings: string) => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0, 
  });

  const prompt = `
    ACT AS: A Lead Software Architect.
    TASK: Refactor the code based on the aggregated audit findings.
    
    AUDIT FINDINGS:
    ${auditFindings}
    
    CURRENT CODE:
    ${currentCode}
    
    GUIDELINES:
    1. Use 'expo-secure-store' for all token operations.
    2. Move auth logic to 'Expo API Routes' (Server-side).
    3. Ensure strict TypeScript typing.
    
    OUTPUT: Return ONLY the refactored code. No conversational text.
  `;

  const response = await model.invoke(prompt);
  return response.content;
};

/**
 * auditUIPage
 * Specialized agent for auditing React Native screens/pages.
 */
export const auditUIPage = async (fileName: string, content: string) => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "qwen/qwen3-32b",
    temperature: 0.1,
  });

  const prompt = `
    ACT AS: A Senior React Native & UX Engineer.
    FILE: ${fileName}
    
    TASK: Audit this UI Screen for CoachAI.
    
    UI-SPECIFIC CRITERIA:
    1. FORM SECURITY: Are inputs (Login/Register) validated using Zod or similar? Is password visibility handled?
    2. DATA LEAKAGE: Is the UI displaying sensitive user info before 'isLoading' is false?
    3. NAVIGATION LOGIC: Does this page redirect correctly if the user is unauthorized?
    4. PROP DRILLING: Is the page fetching data it shouldn't, or passing too many props?
    
    CODE:
    ${content}
    
    OUTPUT: Provide a concise list of UI/Logic fixes. If the page is clean, say "Optimal".
  `;

  const response = await model.invoke(prompt);
  return response.content;
};
export const auditFullProject = async (projectMap: string) => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 0.1,
  });

  const prompt = `
    ACT AS: Principal Software Architect.
    TASK: CoachAI projesinin tüm Auth ve Navigation sistemini denetle.
    
    PROJECT DATA:
    ${projectMap}
    
    ANALİZ KRİTERLERİ:
    1. THE 2-SECOND FLICKER: Neden uygulama ilk açılışta yanlış sayfayı gösteriyor? 
    2. STATE HYDRATION: SecureStore'dan veri okunurken Navigation ağacı nasıl kilitlenmeli?
    3. PROVIDER CONSISTENCY: AuthProvider ve UserProvider arasındaki veri akışı senkron mu?
    4. NAVIGATION GUARDS: Layout seviyesinde eksik olan korumalar neler?

    OUTPUT: Markdown formatında, "Kritik Mimari Riskler" ve "Çözüm Adımları" içeren bir rapor sun.
  `;

  const response = await model.invoke(prompt);
  return response.content;
};