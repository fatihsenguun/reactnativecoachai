import { ChatGroq } from "@langchain/groq";
import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "qwen-2.5-coder-32b",
  temperature: 0.2,
});

const getExpoContext = (): string => {
  try {
    const skillsPath = path.join(__dirname, "../../.skills/expo/expo-api-routes.md");
    return fs.readFileSync(skillsPath, "utf8");
  } catch (error) {
    return "Standard Expo Router and API Routes guidelines apply.";
  }
};

export const auditAuthSystem = async (currentAuthCode: string) => {
  const expoContext = getExpoContext();
  
  const prompt = `
    You are acting as a Senior Expo & Security Expert. 
    Audit my current Auth system using the following official Expo Skills:
    ---
    ${expoContext}
    ---
    Current Implementation Code:
    ${currentAuthCode}
    
    Tasks:
    1. Identify any security vulnerabilities or architectural anti-patterns.
    2. Explain how to modernize this using 'Expo API Routes' (Server-side logic).
    3. Provide a production-ready boilerplate for 'Session Management'.
  `;

  const response = await model.invoke(prompt);
  return response.content;
};
