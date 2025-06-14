import { useEffect, useState } from 'react'
import '../css/Game.css'
import VNMode from '../components/VNMode'
import Toolbar from '../components/Toolbar'
import { useGameStore } from '../hooks/GameStore'
import dialogData from '../assets/data/dialog.json'

function Game() {
  const background = useGameStore((state) => state.background)
  const day = useGameStore((state) => state.day)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const setDialog = useGameStore((state) => state.setDialog)
  const [showDayNotifier, setShowDayNotifier] = useState(false)

  useEffect(()=>{
    moveLocation('hospital-room')

    // play day update animation
    setShowDayNotifier(true)
    const timer1 = setTimeout(() => {
      console.log("in")
      setShowDayNotifier(false)
    }, 2000)

    const newDialog = dialogData[`day-${day}`]
    if (!newDialog) return
    setDialog(newDialog)

    return () => {
      clearTimeout(timer1)
    }
  }, [day])

  return (
    <div 
      id="game"
      style={{ backgroundImage: `url("./locations/${background}")` }}
    >

      <VNMode />

      <Toolbar />

      <div id='day-notifier' className={showDayNotifier ? 'visible' : ''}>
        <p>Day: {day}</p>
      </div>

    </div>
  )
}

export default Game
