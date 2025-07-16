import { useState, useEffect } from 'react'
import './App.css'
import Game from './components/Game'
import Survival from './components/Survival'
import MainMenu from './components/MainMenu'

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  
  const [gameMode, setGameMode] = useState('main-menu')
  //const [gameMode, setGameMode] = useState('story')
  //const [gameMode, setGameMode] = useState('battle')

  // show install button
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    };

    setTimeout(()=>{
      setShowInstall(false)
    }, 1000 * 5)

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  // allow space for clicking
  useEffect(() => {
    const handleSpacebar = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()

        const { clientX, clientY } = getMousePosition()
        const el = document.elementFromPoint(clientX, clientY)
        
        if (el && typeof el.click === 'function') {
          el.click()
        }
      }
    }

    let mouseX = 0;
    let mouseY = 0;
    const getMousePosition = () => ({ clientX: mouseX, clientY: mouseY });
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    window.addEventListener('keydown', handleSpacebar)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleSpacebar)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to install prompt: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstall(false)
    }
  }

  return (
    <div id='app'>
      {showInstall && (
        <button onClick={handleInstallClick} style={{ marginTop: '1rem' }}>
          Install App
        </button>
      )}

      {gameMode==='main-menu' && <MainMenu setGameMode={setGameMode} />}

      {gameMode==='story' && <Game setGameMode={setGameMode} />}

      {gameMode==='battle' && <Survival setGameMode={setGameMode} />}

    </div>
  )
}

export default App
