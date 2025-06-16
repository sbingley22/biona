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
  const pixelated = useGameStore((state) => state.pixelated)

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

  let backgroundImg = './locations/${background}'
  if (pixelated) backgroundImg = './pixelated/locations/${background}'

  return (
    <div id="game">

      <div id='background-container'>
        <img id='background-img'
          //className={pixelated? 'pixelate' : ''}
          src={backgroundImg}
        />
      </div>

      <VNMode />

      <Toolbar />

      <div id='day-notifier' className={showDayNotifier ? 'visible' : ''}>
        <p>Day: {day}</p>
      </div>

    </div>
  )
}

export default Game
