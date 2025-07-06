import { useState } from 'react'
import '../css/Arena.css'
import { useGameStore } from '../hooks/GameStore'
import { convertTypeNames } from '../utils/battleUtils'
import Inventory from './Inventory'

function PartyActions({ turn, turnIndex, setTurnIndex, textInfo, setTextInfo, bionaImage, handleActionClick, allyRef }) {
  const setMode = useGameStore((state) => state.setMode)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const handleAction = useGameStore((state) => state.handleAction)
  const arena = useGameStore((state) => state.arena)
  const setArena = useGameStore((state) => state.setArena)
  const convertCharacterName = useGameStore((state) => state.convertCharacterName)
  const party = useGameStore((state) => state.party)
  const partyStats = useGameStore((state) => state.partyStats)
  const setPartyStats = useGameStore((state) => state.setPartyStats)
  const bionas = useGameStore((state) => state.bionas)

  const [showInventory, setShowInventory] = useState(false)

  const removeAllStatusEffects = () => {
    const tempPartyStats = {...partyStats}
    Object.keys(tempPartyStats).forEach(name => {
      tempPartyStats[name].statusEffects = []
    })
    setPartyStats(tempPartyStats)
  }

  const handleTextClick = () => {
    if (textInfo[0].character === "stage won") {
      removeAllStatusEffects()
      //debugger
      if (arena.outro) setTextInfo(arena.outro)
      else setArena(null)
      return
    }
    if (textInfo[0].character === "stage lost") {
      removeAllStatusEffects()
      setArena(null)
      return
    }
    if (textInfo[0].character === "stage complete") {
      setArena(null)
      return
    }
    if (textInfo[0].character === "exit battle mode") {
      setArena(null)
      setMode("vn")
      moveLocation('hospital-room')
      handleAction('next-day')
      return
    }
    if (textInfo[0].character === "turn end") setTurnIndex(turnIndex + 1)
    const tempTextInfo = [...textInfo]
    tempTextInfo.shift()
    setTextInfo(tempTextInfo)
  }

  const handleSkipClick = () => {
    setTextInfo([{"character": "turn end", "text": `${convertCharacterName(party[turnIndex])} skipped turn`}])
  }

  const handleInventoryClick = () => {
    setShowInventory(true)
  }

  return (
    <>
      {showInventory && <Inventory 
        setShowInventory={setShowInventory} 
        turnIndex={turnIndex}
        setTextInfo={setTextInfo}
      />}

      <div id='party-container'>
        <img 
          ref={allyRef}
          src={bionaImage} 
        />
      </div>

      {textInfo && textInfo.length > 0 ? 
        <div 
          id='info'
          onClick={handleTextClick}
        >
          {textInfo[0].character && textInfo[0].character !== "turn end" && 
            <h3>{convertCharacterName(textInfo[0].character)}</h3>
          }
          <p>{textInfo[0].text}</p>
        </div>
      :
        <div id='party-actions'>
          {turn && <div id='extra-actions'>
            <button onClick={()=>handleInventoryClick()}>Items</button>
            <button onClick={()=>handleSkipClick()}>Skip</button>
          </div>}
          {turn && bionas.map((bio, i) => {
            if (i !== turnIndex) return null
            return (
              <div key={'bio' + i} className='biona-actions'>
                {bio.actions.map(ba => (
                  <div 
                    key={ba.name} 
                    className='action-card'
                    onClick={()=>handleActionClick(ba)}
                  >
                    <p style={{color: '#999', fontWeight: 'bold'}}>{ba.name}</p>
                    <div className='dmg-type'>
                      <p>{convertTypeNames(ba.type)}:</p>
                      <p>{ba.dmg}</p>
                      {ba.multi && <p>*</p>}
                    </div>
                    {ba.cost?.map((c, i) => {
                      if (i%2===0) return null
                      const costType = ba.cost[i-1]
                      const costAmount = c
                      return (<span key={i} style={{color:'red'}}>{`${costType[0].toUpperCase()}:${costAmount} `}</span>)
                    })}
                  </div>
                ))}
              </div>
            )
          })}
          <div id='party-stats'>
            {party.map((pName,index) => {
              const p = partyStats[pName]
              const name = convertCharacterName(pName)
              let className = 'member-stats'
              if (turn && turnIndex===index) className += ' turn'
              return (
                <div 
                  key={pName} 
                  className={className}
                >
                  <p style={{color:'#999', fontWeight:'bold'}}>{name}</p>
                  <p style={{color: "green"}}>H: {p.health}/{p.maxHealth}</p>
                  <p style={{color: "yellow"}}>E: {p.energy}/{p.maxEnergy}</p>
                </div>
              )
            })}
          </div>
        </div>
      }
    </>
  )
}

export default PartyActions
