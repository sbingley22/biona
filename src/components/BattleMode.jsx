import '../css/BattleMode.css'
import { useGameStore } from '../hooks/GameStore'
import BattlePrep from './BattlePrep'

function BattleMode() {
  const day = useGameStore((state) => state.day)

  return (
    <div id='battle-mode'>
      <p>Battle MODE</p>
      <BattlePrep />
    </div>
  )
}

export default BattleMode
