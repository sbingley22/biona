import '../css/BattlePrep.css'
import { useGameStore } from '../hooks/GameStore'
import stages from '../assets/data/stages.json'
import { useEffect, useState } from 'react'
import { findNonMatchingStrings } from '../utils/battleUtils'

function BattlePrep({ isSurvivalMode=false, setGameMode=null }) {
  const handleAction = useGameStore((state) => state.handleAction)
  const setMode = useGameStore((state) => state.setMode)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const setArena = useGameStore((state) => state.setArena)
  const stage = isSurvivalMode ? "survival" : useGameStore((state) => state.stage)
  const stageLevels = useGameStore((state) => state.stageLevels)
  const convertCharacterName = useGameStore((state) => state.convertCharacterName)
  const party = useGameStore((state) => state.party)
  const setParty = useGameStore((state) => state.setParty)
  const allies = useGameStore((state) => state.allies)

  const [arenaList, setArenaList] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(-1)
  const [availableAllies, setAvailableAllies] = useState([])

  const stageLevel = stageLevels[stage]

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
    if (!isSurvivalMode && index > stageLevel) {
      console.warn("Cannot go to this stage yet", stageLevel, index)
      return
    }
    const a = stages[stage][index]
    if (!a) {
      console.warn(`Couldn't find arena for ${stage} at ${index}`)
    }
    setArena(a)
  }

  const handlePartyClick = (slot) => {
    if (slot === 0) return
    if (slot >= party.length) {
      // show available party members to add
      setAvailableAllies(findNonMatchingStrings(party, allies))
      setSelectedSlot(slot)
    }
    else {
      // remove party members
      const tempParty = [...party]
      tempParty.splice(slot, 1)
      setParty(tempParty)
    }
  }

  const addAllyToParty = (ally) => {
    const tempParty = [...party]
    tempParty.push(ally)
    setParty(tempParty)
    setSelectedSlot(-1)
  }

  const handleLeave = () => {
    if (isSurvivalMode) {
      setGameMode('main-menu')
      return
    }
    setArena(null)
    setMode("vn")
    moveLocation('hospital-room')
    handleAction({"action": 'next-day'})
  }

  return (
    <div id='battle-prep'>
      <div id='stage-selection'>
        <h3>{convertCharacterName(stage)}</h3>
        {arenaList.map((a, index) => (
          <button
            key={a.name}
            onClick={()=>handleArenaClick(index)}
            className={index > stageLevel && !isSurvivalMode ? 'locked': ''}
          >{a.name}</button>
        ))}
      </div>

      <div id='party-selection'>
        <h3>Party</h3>
        {party.map((p,index) => (
          <button
            key={p+index}
            onClick={()=>handlePartyClick(index)}
          >{convertCharacterName(p)}</button>
        ))}
        {party.length < 4 &&
          <button
            onClick={() => handlePartyClick(party.length)}
          >+</button>
        }
      </div>

      {selectedSlot !== -1 && availableAllies.length > 0 && <div id='member-selector'>
        {availableAllies.map((a,i) => (
          <button key={a + i} onClick={()=>addAllyToParty(a)}>{convertCharacterName(a)}</button>
        ))}
        <button onClick={()=>setSelectedSlot(-1)}>Cancel</button>
      </div>}

      <button id='leave-dungeon' onClick={handleLeave}>
        Leave Bionaverse
      </button>
    </div>
  )
}

export default BattlePrep
