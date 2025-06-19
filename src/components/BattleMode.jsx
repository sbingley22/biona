import '../css/BattleMode.css'
import { useGameStore } from '../hooks/GameStore'
import BattlePrep from './BattlePrep'
import Arena from './Arena'

function BattleMode() {
  const day = useGameStore((state) => state.day)
  const arena = useGameStore((state) => state.arena)

  return (
    <div id='battle-mode'>

      {!arena && <BattlePrep />}

      {arena && <Arena />}

    </div>
  )
}

export default BattleMode
