import React, { useState, useEffect } from 'react';

function Game() {
  return (
    <>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => alert('Guess!')}>Option 1</button>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => alert('Guess!')}>Option 2</button>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => alert('Guess!')}>Option 3</button>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => alert('Guess!')}>Option 4</button>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => alert('Guess!')}>Option 5</button>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => alert('Guess!')}>Option 6</button>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => alert('Guess!')}>Option 7</button>
      </div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-1 rounded-full" 
          onClick={() => alert('Guess!')}>Option 8</button>
      </div>
    </>
  );
}

export default Game;
