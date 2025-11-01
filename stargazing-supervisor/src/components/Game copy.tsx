import React, { useState, useEffect } from 'react';
import Cafe from './Cafe';
// import baristaPng from '../assets/barista-male.png';
// import npcPng from '../assets/npc 1.png';

function Game() {
  const [day, setDay] = useState(1);
  const [queue, setQueue] = useState(0);

  useEffect(() => {
    // Fetch the queue size from the API
    fetch('/api/queue')
      .then(res => res.json())
      .then(data => {
        setQueue(data.queue);
      });
  }, [day]);

  return (
    <>
    <div>
      <h2>Day: {day}</h2>
      <Cafe queue={queue} />
      <button onClick={() => setDay(day + 1)}>Next Day</button>
    </div>
    {/* <div> */}
      {/* <img src={npcPng} className="logo npc" alt="NPC Logo" />
      <img src={baristaPng} className="logo barista" alt="Barista Logo" />
      <img src={baristaPng} className="logo barista" alt="Barista Logo" />
      <img src={baristaPng} className="logo barista" alt="Barista Logo" /> */}
    {/* </div> */}
    </>
  );
}

export default Game;
