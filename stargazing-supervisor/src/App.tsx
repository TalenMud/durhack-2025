import Game from './components/Game';
 import Chat from './Chat';
 import { getRandomPersonaPrompt } from './randomGuy';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  const PersonaPrompt = getRandomPersonaPrompt();
  return (
    
    <div>
      <h1>Guess the historical figure</h1>
      <Game />
      <Chat />
    </div>
    </>
  );  
}

export default App;
