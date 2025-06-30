import '../css/Inventory.css'
import { useGameStore } from '../hooks/GameStore'

function Inventory () {
  const party = useGameStore((state) => state.party)
  const partyStats = useGameStore((state) => state.partyStats)
  const bionas = useGameStore((state) => state.bionas)
  const inventory = useGameStore((state) => state.inventory)
  const addItem = useGameStore((state) => state.addItem)
  const removeItem = useGameStore((state) => state.removeItem)

  return (
    <div id="inventory">
    </div>
  )
}

export default Inventory
