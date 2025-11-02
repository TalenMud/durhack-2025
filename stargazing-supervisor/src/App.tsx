import Game from './components/Game';
import Header from './components/Header';
import Chat from './Chat';
import { getRandomPersonaPrompt } from './randomGuy';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';





function App() {
  const PersonaPrompt = getRandomPersonaPrompt();
  return (
    
    <div>
      <Header />
      <h1>Who's that historical person?</h1>
      <Game />
      <Chat />
    </div>
    </>
  );  
}

export default App;
