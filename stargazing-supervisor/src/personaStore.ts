import { getRandomPersonaPrompt } from './randomGuy'; // Assuming randomGuy.ts exports the persona logic

let selectedPersona: { systemInstruction: string; internalId: string } | null = null;

export function getOrSetPersona() {
  if (!selectedPersona) {
    selectedPersona = getRandomPersonaPrompt();
  }
  return selectedPersona;
}

export function overwritePersona() {
  selectedPersona = getRandomPersonaPrompt();
  console.log("New Persona Selected:", getPersonaInternalId());
}

export function getPersonaSystemInstruction() {
  return selectedPersona?.systemInstruction;
}

export function getPersonaInternalId() {
  return selectedPersona?.internalId;
}