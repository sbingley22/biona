import '../css/BattlePrep.css'
import { useGameStore } from '../hooks/GameStore'
import stages from '../assets/data/stages.json'
import enemies from '../assets/data/enemies.json'
import allies from '../assets/data/allies.json'
import { useEffect, useState } from 'react'

function BattlePrep() {
  const day = useGameStore((state) => state.day)
  const handleAction = useGameStore((state) => state.handleAction)
  const setMode = useGameStore((state) => state.setMode)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const setArena = useGameStore((state) => state.setArena)
  const stage = useGameStore((state) => state.stage)
  const convertCharacterName = useGameStore((state) => state.convertCharacterName)

  const [arenaList, setArenaList] = useState([])
  const [partyList, setPartyList] = useState([
    "sean", "sofia", "boy", "+"
  ])

  useEffect(()=>{
    const stageArenas = stages[stage]
    if (!stageArenas) {
      console.warn("couldn't find any arenas for stage: ", stage)
    }
    //console.log(stageArenas)

    const tempArenaList = []
    stageArenas.forEach((sa, index) => {
      tempArenaList.push({
        level: index,
        name: sa.name,
        unlocked: true
      })
    })
    setArenaList(tempArenaList)
  }, [stage])

  const handleArenaClick = (index) => {
    const a = stages[stage][index]
    if (!a) {
      console.warn(`Couldn't find arena for ${stage} at ${index}`)
    }
    setArena(a)
  }

  const handlePartyClick = (slot) => {
    console.log("show available party members for slot: ", slot)
  }

  const handleLeave = () => {
    setArena(null)
    setMode("vn")
    moveLocation('hospital-room')
    handleAction('next-day')
  }

  return (
    <div id='battle-prep'>
      <div id='stage-selection'>
        <h3>{convertCharacterName(stage)}</h3>
        {arenaList.map((a, index) => (
          <button
            key={a.name}
            onClick={()=>handleArenaClick(index)}
          >{a.name}</button>
        ))}
      </div>

      <div id='party-selection'>
        <h3>Party</h3>
        {partyList.map((p,index) => (
          <button
            key={p+index}
            onClick={()=>handlePartyClick(index)}
          >{convertCharacterName(p)}</button>
        ))}
      </div>

      <button id='leave-dungeon' onClick={handleLeave}>
        Leave Bionaverse
      </button>
    </div>
  )
}

export default BattlePrep
