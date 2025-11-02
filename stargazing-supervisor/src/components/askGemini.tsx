import { GoogleGenAI } from "@google/genai";
<<<<<<< HEAD

const ai = new GoogleGenAI({ apiKey: "AIzaSyDykp8qgYySAjECdY-jsfOmc8cXQ4G-z9U" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "LOL",
  });
  console.log(response.text);
}
=======
import { useEffect } from "react";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDykp8qgYySAjECdY-jsfOmc8cXQ4G-z9U" });

export default function GeminiPing() {
  useEffect(() => {
    (async () => {
      try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent("Say 'pong' and 1+1=");
        console.log("OK:", res.response.text());
      } catch (e) {
        console.error("Gemini error:", e);
      }
    })();
  }, []);
  return null;
>>>>>>> ebf4012 (lol)

main();