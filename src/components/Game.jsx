import { useEffect } from 'react'
import '../css/Game.css'
import VNMode from '../components/VNMode'
import Toolbar from '../components/Toolbar'
import { useGameStore } from '../hooks/GameStore'
import dialogData from '../assets/data/dialog.json'

function Game() {
  const background = useGameStore((state) => state.background)
  const day = useGameStore((state) => state.day)
  const setDialog = useGameStore((state) => state.setDialog)

  useEffect(()=>{
    const newDialog = dialogData[`day-${day}`]
    if (!newDialog) return
    setDialog(newDialog)
  }, [day])

  return (
    <div 
      id="game"
      style={{ backgroundImage: `url("./locations/${background}")` }}
    >

      <VNMode />

      <Toolbar />

    </div>
  )
}

export default Game
