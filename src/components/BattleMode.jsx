import '../css/BattleMode.css'
import { useGameStore } from '../hooks/GameStore'

function BattleMode() {
  const bears = useGameStore((state) => state.bears)
  const increaseBears = useGameStore((state) => state.increasePopulation)

  return (
    <div>
      <p>Battle MODE</p>
      <h1>{bears} around here </h1>
      <button onClick={increaseBears}>one up</button>
    </div>
  )
}

export default BattleMode
