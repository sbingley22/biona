import '../css/BattlePrep.css'
import { useGameStore } from '../hooks/GameStore'

function BattlePrep() {
  const day = useGameStore((state) => state.day)

  return (
    <div id='battle-prep'>
      <p>Battle Prep</p>
    </div>
  )
}

export default BattlePrep
