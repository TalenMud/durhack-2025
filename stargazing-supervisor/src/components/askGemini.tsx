import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDykp8qgYySAjECdY-jsfOmc8cXQ4G-z9U" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "LOL",
  });
  console.log(response.text);
}

main();