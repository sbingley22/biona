import '../css/VNMode.css'
import { useGameStore } from '../hooks/GameStore'
import Dialog from './Dialog'

function VNMode() {
  const dialog = useGameStore((state) => state.dialog)

  return (
    <div id='vn-mode'>

      {!dialog && 
      <div id='character-selection'>
        <img 
          id='character' 
          src='./characters/sofia-square.png'
        />
        <img 
          id='character' 
          src='./characters/sofia-square.png'
        />
      </div>}

      {dialog && <Dialog />}

    </div>
  )
}

export default VNMode
