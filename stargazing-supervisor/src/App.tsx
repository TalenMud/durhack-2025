import Game from './components/Game';
import Header from './components/Header';
import Chat from './Chat';
import { useState } from 'react';
import { getOrSetPersona } from './personaStore.ts';


function App() {
  getOrSetPersona();

  const [currentConversationId, setCurrentConversationId] = useState(() => `human-vs-bot-${crypto.randomUUID()}`);
  
  return (<>    
    <div>
      <Header />
      <h1>Who's that historical person?</h1>
      <div className="flex flex-row gap-4">
        <Chat currentConversationId={currentConversationId}/>
        <Game setCurrentConversationId={setCurrentConversationId}/>
      </div>
    </div>
    </>
  );  
}

export default App;
