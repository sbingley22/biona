import '../css/Inventory.css'
import { useGameStore } from '../hooks/GameStore'
import itemsData from '../assets/data/items.json'

function Inventory ({ setShowInventory, turnIndex, setTextInfo }) {
  const party = useGameStore((state) => state.party)
  const partyStats = useGameStore((state) => state.partyStats)
  const setPartyStats = useGameStore((state) => state.setPartyStats)
  const bionas = useGameStore((state) => state.bionas)
  const inventory = useGameStore((state) => state.inventory)
  const removeItem = useGameStore((state) => state.removeItem)

  const handleItemClick = (itemName) => {
    const item = itemsData[itemName]
    if (!item) {
      console.warn("couldn't find item", itemName)
      return
    }

    const newStats = structuredClone(partyStats) // safe deep clone

    const user = newStats[party[turnIndex]]

    if (item.type === "healing") {
      if (item.multi) {
        party.forEach((memberName) => {
          const member = newStats[memberName]
          member.health += item.value
          if (member.health > member.maxHealth) member.health = member.maxHealth
        })
      } else {
        user.health += item.value
        if (user.health > user.maxHealth) user.health = user.maxHealth
      }
    }
    else if (item.type === "energizing") {
      if (item.multi) {
        party.forEach((memberName) => {
          const member = newStats[memberName]
          member.energy += item.value
          if (member.energy > member.maxEnergy) member.energy = member.maxEnergy
        })
      } else {
        user.energy += item.value
        if (user.energy > user.maxEnergy) user.energy = user.maxEnergy
      }
    }
    else if (item.type === "cure") {
      if (item.multi) {
        party.forEach(memberName => {
          const member = newStats[memberName]
          member.statusEffects = member.statusEffects.filter(effect => effect.type !== item.ailment)
        })
      } else {
        user.statusEffects = user.statusEffects.filter(effect => effect.type !== item.ailment)
      }
    }

    setPartyStats(newStats)

    setTextInfo([{
      character: "turn end", 
      text: `${party[turnIndex]} used ${itemName} (${item.description})`
    }])
    removeItem(itemName)
    setShowInventory(false)
  }

  return (
    <div id="inventory">
      <button id='close-inv' onClick={()=>setShowInventory(false)}>X</button>

      <div id='item-container'>
        {Object.keys(inventory).map((itemName) => (
          <button
            key={itemName}
            onClick={()=>handleItemClick(itemName)}
          >
            {itemName + ' [' + inventory[itemName] + ']'}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Inventory
