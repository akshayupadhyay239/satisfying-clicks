import { useState } from 'react'
import './App.css'
import Home from "./components/Home";
import BubbleWrap from "./components/BubbleWrap";

function App() {
  const [screen, setScreen] = useState<'home' | 'bubble'>('home');

  return screen === 'home' ? (
    <Home onOpenBubbleWrap={() => setScreen('bubble')} />
  ) : (
    <BubbleWrap onBack={() => setScreen('home')} />
  );
}

export default App
