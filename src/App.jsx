import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Hello! This app works offline after first visit.')
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    console.log('App mounted');
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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Offline React App</h1>
      <p>{message}</p>
      {showInstall && (
        <button onClick={handleInstallClick} style={{ marginTop: '1rem' }}>
          Install App
        </button>
      )}
    </div>
  )
}

export default App
