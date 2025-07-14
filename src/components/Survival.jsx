import { useEffect, useState } from 'react'
import '../css/Game.css'
import BattleMode from '../components/BattleMode'
import { useGameStore } from '../hooks/GameStore'

function Survival({ setGameMode }) {
  const background = useGameStore((state) => state.background)
  const setDevMode = useGameStore((state) => state.setDevMode)
  const setArena = useGameStore((state) => state.setArena)

  useEffect(()=>{
    //setDevMode(true)
    setArena(null)
  }, [])

  return (
    <div id="game">

      <div id='background-container'>
        <img 
          id='background-img'
          src={`./locations/${background}`}
          className="blur"
        />
      </div>

      <BattleMode
        isSurvivalMode={true}
        setGameMode={setGameMode}
      />

    </div>
  )
}

export default Survival
