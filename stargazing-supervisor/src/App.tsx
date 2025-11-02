// import React from 'react';
import Game from './components/Game';
import Header from './components/Header';
// import Chat from './Chat';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';





function App() {
  return (<>
    <div>
      <Header />
      <h1>Who's that historical person?</h1>
      <Game />
      {/* <Chat /> */}
    </div>
    </>
  );  
}

export default App;
