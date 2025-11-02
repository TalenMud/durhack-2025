import React, { useState, useEffect } from 'react';
import { getOrSetPersona, getPersonaInternalId, overwritePersona } from '../personaStore.ts';
import { personaList, type PersonaPrompt} from '../randomGuy.ts';


const chatbotPersona = getOrSetPersona();
const getBestStreak = (): number => {
  const storedStreak = localStorage.getItem('personaBestStreak');
  return storedStreak ? parseInt(storedStreak, 10) : 0;
};


// Define a map for button text and emojis (since they are not in the list object)
const buttonDisplayMap: { [key: string]: { text: string; emoji: string } } = {
  Caveman: { text: 'Caveman', emoji: '🧌' },
  AncientEgyptianScribe: { text: 'Ancient Egyptian Scribe', emoji: '🛕' },
  GreekPhilosopher: { text: 'Greek Philosopher', emoji: '🏛️' },
  Wizard: { text: 'Middle Age Wizard', emoji: '🪄' },
  ChildWorker: { text: 'Victorian Child Worker', emoji: '👧🏻' },
  SoldierWW2: { text: 'WW2 Soldier', emoji: '🪖' },
  Teen80s: { text: '80s Teen', emoji: '👦' },
  Vampire: { text: 'Vampire', emoji: '🦇' },
};

// Function to get a random subset of an array
const getRandomSubset = (array: PersonaPrompt[], count: number): PersonaPrompt[] => {
  // 1. Create a copy of the array to avoid modifying the original
  const shuffled = [...array]
      // 2. Sort the array using a random comparator (the key to shuffling)
      .sort(() => 0.5 - Math.random())
  
  // 3. Take the first 'count' elements
  return shuffled.slice(0, count);
};

function Game(props:{setCurrentConversationId:(id:string)=> void}) {
  const remainingPersonas = personaList.filter(persona => persona.internalId !== chatbotPersona.internalId);
  const randomSubset = getRandomSubset(remainingPersonas, 3);
  // Use useState to store the 4 randomly selected personas.
  // The function passed to useState runs once on the initial render.
  const [buttonPersonas, setButtonPersonas] = useState<PersonaPrompt[]>(() => 
    [...randomSubset, chatbotPersona].sort(() => 0.5 - Math.random())
  );

  // State for the current consecutive correct guesses
  const [currentStreak, setCurrentStreak] = useState(0); 

  // State for the all-time best consecutive correct guesses, loaded from storage
  const [bestStreak, setBestStreak] = useState<number>(getBestStreak);

  function resetGame(){
    overwritePersona();
    props.setCurrentConversationId(`human-vs-bot-${crypto.randomUUID()}`);
    
    // Get the current persona used by the chatbot
  const chatbotPersona = getOrSetPersona();

  // Generate a random subset excluding the chatbot's persona
  const remainingPersonas = personaList.filter(persona => persona.internalId !== chatbotPersona.internalId);
  const randomSubset = getRandomSubset(remainingPersonas, 3);

    
    // Add the chatbot's persona to the list and shuffle
  const newButtonPersonas = [...randomSubset, chatbotPersona].sort(() => 0.5 - Math.random());

  // Update the state with the new button personas
  setButtonPersonas(newButtonPersonas);
  }

  function checkID(guessValue: string) {
    const personaID = getPersonaInternalId();
    if (personaID == null) {
      return;
    } 
    console.log("Persona ID:", personaID);
    console.log("Guess Value:", guessValue);
    if (personaID === guessValue) {
      alert("Correct! You guessed the historical person!");

      // CORRECT GUESS: Increment current streak
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        // Save the new best streak to Local Storage
        localStorage.setItem('personaBestStreak', newStreak.toString());
      }
    } else {
      alert(`Incorrect guess. The persona was ${buttonDisplayMap[personaID].text}. Your streak is broken!`);
      // INCORRECT GUESS: Reset current streak
      setCurrentStreak(0);
    }
    resetGame();
  }

  

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-white-800">
            🔥 Current Streak: {currentStreak} | 🏆 Best Streak: {bestStreak}
        </h2>
      </div>
      <div className="flex flex-col">
        {/* Map over the state variable which holds the 4 random personas */}
        {buttonPersonas.map((persona) => {
          const display = buttonDisplayMap[persona.internalId] || { text: persona.internalId, emoji: '' };
          return (
            <button 
              key={persona.internalId} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
              onClick={() => checkID(persona.internalId)}
            >
              {display.text} {display.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Game;
