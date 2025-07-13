import '../css/BattleMode.css'
import { useGameStore } from '../hooks/GameStore'
import BattlePrep from './BattlePrep'
import Arena from './Arena'

function BattleMode({ isSurvivalMode=false, setGameMode=null }) {
  const arena = useGameStore((state) => state.arena)

  return (
    <div id='battle-mode'>

      {!arena && 
        <BattlePrep 
          isSurvivalMode={isSurvivalMode}
          setGameMode={setGameMode}
        />
      }

      {arena && 
        <Arena 
          isSurvivalMode={isSurvivalMode}
          setGameMode={setGameMode}
        />
      }

    </div>
  )
}

export default BattleMode
