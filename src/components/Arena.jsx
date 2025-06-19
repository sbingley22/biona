import '../css/Arena.css'
import { useGameStore } from '../hooks/GameStore'

function Arena() {
  const day = useGameStore((state) => state.day)
  const setArena = useGameStore((state) => state.setArena)

  return (
    <div id='arena'>
      <p>arena</p>
    </div>
  )
}

export default Arena
