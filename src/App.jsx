import { useState, useEffect } from 'react'
import './App.css'
import Game from './components/Game'
import MainMenu from './components/MainMenu'

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  
  const [gameMode, setGameMode] = useState('main-menu')
  //const [gameMode, setGameMode] = useState('story')
  //const [gameMode, setGameMode] = useState('battle')

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    setTimeout(()=>{
      setShowInstall(false)
    }, 1000 * 5)

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    //console.log('App mounted');
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  return (
    <div id='app'>
      {showInstall && (
        <button onClick={handleInstallClick} style={{ marginTop: '1rem' }}>
          Install App
        </button>
      )}

      {gameMode==='main-menu' && <MainMenu setGameMode={setGameMode} />}

      {gameMode==='story' && <Game setGameMode={setGameMode} />}

      {gameMode==='battle' && <Game setGameMode={setGameMode} />}

    </div>
  )
}

export default App
