import { useEffect, useState } from 'react'
import '../css/Game.css'
import VNMode from '../components/VNMode'
import Toolbar from '../components/Toolbar'
import BattleMode from '../components/BattleMode'
import { useGameStore } from '../hooks/GameStore'
import dialogData from '../assets/data/dialog.json'

function Game() {
  const background = useGameStore((state) => state.background)
  const day = useGameStore((state) => state.day)
  const mode = useGameStore((state) => state.mode)
  const setDevMode = useGameStore((state) => state.setDevMode)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const setDialog = useGameStore((state) => state.setDialog)
  const [showDayNotifier, setShowDayNotifier] = useState(false)

  useEffect(()=>{
    setDevMode(true)
  }, [])

  useEffect(()=>{
    moveLocation('hospital-room')

    // play day update animation
    setShowDayNotifier(true)
    const timer1 = setTimeout(() => {
      setShowDayNotifier(false)
    }, 200)

    const newDialog = dialogData[`day-${day}`]
    if (!newDialog) return
    setDialog(newDialog)

    return () => {
      clearTimeout(timer1)
    }
  }, [day])

  return (
    <div id="game">

      <div id='background-container'>
        <img 
          id='background-img'
          src={`./locations/${background}`}
          className={mode==="battle" ? "blur" : ""}
        />
      </div>

      {mode === "vn" && <VNMode />}

      {mode === "battle" && <BattleMode />}

      <Toolbar />

      <div id='day-notifier' className={showDayNotifier ? 'visible' : ''}>
        <p>Day: {day}</p>
      </div>

    </div>
  )
}

export default Game
