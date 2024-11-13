import React from 'react';
import Game from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Bernice's Bubble Blast</h1>
        <p className="text-purple-200">Pop bubbles, score points, have fun!</p>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;