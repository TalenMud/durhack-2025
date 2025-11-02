import React, { useState, useEffect } from 'react';
import { getPersonaInternalId, overwritePersona } from '../personaStore.ts';

function Game(props:{setCurrentConversationId:(id:string)=> void}) {

  function resetGame(){
    overwritePersona();
    props.setCurrentConversationId(`human-vs-bot-${crypto.randomUUID()}`);
  }
  // const [guess, setGuess] = useState("none");

  function checkID(guessValue: string) {
    const personaID = getPersonaInternalId();
    console.log("Persona ID:", personaID);
    console.log("Guess Value:", guessValue);
    if (personaID === guessValue) {
      alert("Correct! You guessed the historical person!");
    } else {
      alert("Incorrect guess. Try again!");
    }
    resetGame();
  }

  return (
    <>
      <div className="flex flex-col">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => checkID("Caveman")}>Caveman 🧌</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => checkID("AncientEgyptianScribe")}>Ancient Egyptian Scribe 🛕</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => checkID("GreekPhilosopher")}>Greek Philosopher 🏛️</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => checkID("Wizard")}>Middle Age Wizard 🪄</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => checkID("ChildWorker")}>Victorian Child Worker 👧🏻</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => checkID("SoldierWW2")}>WW2 Soldier 🪖</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => checkID("Teen80s")}>80s Teen 👦</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => checkID("Vampire")}>Vampire 🦇</button>
      </div>
    </>
  );
}

export default Game;
