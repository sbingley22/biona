import { useEffect, useState } from 'react'
import '../css/Game.css'
import VNMode from '../components/VNMode'
import Toolbar from '../components/Toolbar'
import BattleMode from '../components/BattleMode'
import { useGameStore } from '../hooks/GameStore'
import dialogData from '../assets/data/dialog.json'

function Game({ setGameMode }) {
  const background = useGameStore((state) => state.background)
  const day = useGameStore((state) => state.day)
  const mode = useGameStore((state) => state.mode)
  const devMode = useGameStore((state) => state.devMode)
  const setDevMode = useGameStore((state) => state.setDevMode)
  const setParty = useGameStore((state) => state.setParty)
  const levelUpParty = useGameStore((state) => state.levelUpParty)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const setDialog = useGameStore((state) => state.setDialog)
  const [showDayNotifier, setShowDayNotifier] = useState(false)

  useEffect(()=>{
    setDevMode(true)
  }, [])

  useEffect(()=>{
    setParty(['sean', 'sofia', 'boy'])
    levelUpParty(10)
  }, [devMode])

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

      <Toolbar setGameMode={setGameMode} />

      <div id='day-notifier' className={showDayNotifier ? 'visible' : ''}>
        <p>Day: {day}</p>
      </div>

    </div>
  )
}

export default Game
