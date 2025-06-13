import '../css/VNMode.css'
import { useGameStore } from '../hooks/GameStore'

function VNMode() {
  const dialog = useGameStore((state) => state.dialog)

  return (
    <div id='vn-mode'>
      <p>VN MODE</p>
    </div>
  )
}

export default VNMode
