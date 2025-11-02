import React, { useState, useEffect } from 'react';
import { getPersonaInternalId, overwritePersona } from '../personaStore.ts';
import ahhhh from '../sfx/ahhhh.mp3';
import bruh from '../sfx/bruh.ogg';
import clashOfClans from '../sfx/clash_of_clans.mp3';
import clashRoyale from '../sfx/clash_royale.mp3';
import fbiOpenUp from '../sfx/fbi_open_up.mp3';
import getOutTuco from '../sfx/get_out_tuco.mp3';
import goofyAhhLaugh from '../sfx/goofy_ahh_laugh.ogg';
import goofyAhhSounds from '../sfx/goofy_ahh_sounds.ogg';
import iLikeYaCutG from '../sfx/I_like_ya_cut_g.mp3';
import sadViolin from '../sfx/sad_violin.ogg';
import stopTheCap from '../sfx/stop_the_cap.mp3';
import vineboom from '../sfx/vineboom.mp3';
import wetFartMeme from '../sfx/wet_fart_meme.mp3';
import yeet from '../sfx/yeet.mp3';

function Game(props:{setCurrentConversationId:(id:string)=> void}) {

  function resetGame(){
    overwritePersona();
    props.setCurrentConversationId(`human-vs-bot-${crypto.randomUUID()}`);
  }

  function checkID(guessValue: string) {
    const personaID = getPersonaInternalId();
    console.log("Persona ID:", personaID);
    console.log("Guess Value:", guessValue);
    if (personaID === guessValue) {
      const sounds = [
          clashOfClans, clashRoyale, iLikeYaCutG
        ];
      const sound = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
      sound.play();
      alert("Correct! You guessed the historical person!");
    } else {
      const sounds = [
          ahhhh, bruh, fbiOpenUp, getOutTuco,
          goofyAhhLaugh, goofyAhhSounds, sadViolin,
          stopTheCap, vineboom, wetFartMeme, yeet
        ];
      const sound = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
      sound.play();
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
