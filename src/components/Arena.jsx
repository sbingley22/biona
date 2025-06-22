import { useEffect, useState } from 'react'
import '../css/Arena.css'
import { useGameStore } from '../hooks/GameStore'
import enemyData from '../assets/data/enemies.json'
import allyData from '../assets/data/allies.json'

function Arena() {
  const arena = useGameStore((state) => state.arena)
  const setArena = useGameStore((state) => state.setArena)
  const convertCharacterName = useGameStore((state) => state.convertCharacterName)
  const party = useGameStore((state) => state.party)
  const partyStats = useGameStore((state) => state.partyStats)
  const bionas = useGameStore((state) => state.bionas)

  const [turn, setTurn] = useState(true)
  const [turnIndex, setTurnIndex] = useState(0)
  const [textInfo, setTextInfo] = useState([])
  const [enemies, setEnemies] = useState([])

  // load arena
  useEffect(()=>{
    if (arena.intro) setTextInfo(arena.intro)
    if (arena.enemies) {
      const tempEnemies = []
      arena.enemies.forEach(en => {
        if (enemyData[en]) tempEnemies.push(enemyData[en])
        else console.warn(`Couldn't find ${en} enemy data`, enemyData, en)
      })
    }
    
  }, [arena])

  // handle team turns
  useEffect(()=>{
    setTurnIndex(0)

  }, [turn])

  // handle individual turns
  useEffect(()=>{
    if (!turn && turnIndex >= enemies.length) {
      setTurn(!turn)
      return
    }
    if (turn && turnIndex >= party.length) {
      setTurn(!turn)
      return
    }

  }, [turnIndex])

  const handleTextClick = () => {
    const tempTextInfo = [...textInfo]
    tempTextInfo.shift()
    setTextInfo(tempTextInfo)
  }

  return (
    <div id='arena'>

      <div id='enemy-container'>
      </div>

      <div id='party-container'>
      </div>

      {textInfo.length > 0 ? 
        <div 
          id='info'
          onClick={handleTextClick}
        >
          {textInfo[0].character && <h3>{convertCharacterName(textInfo[0].character)}</h3>}
          <p>{textInfo[0].text}</p>
        </div>
      :
        <div id='party-actions'>
          {turn && bionas.map((bio, i) => {
            return (
              <div key={'bio' + i} className='biona-actions'>
                {bio.actions.map(ba => (
                  <div key={ba.name} className='action-card'>
                    <p>{ba.name}</p>
                    <p>{ba.type}</p>
                    <p>{ba.dmg}</p>
                    {ba.cost?.map((c, i) => {
                      if (i%2===0) return null
                      const costType = ba.cost[i-1]
                      const costAmount = c
                      return (<p key={i}>{`${costType} - ${costAmount}`}</p>)
                    })}
                  </div>
                ))}
              </div>
            )
          })}
          {party.map(pName => {
            const p = partyStats[pName]
            const name = convertCharacterName(pName)
            return (
              <div key={pName} className='party-stats'>
                <p>{name}</p>
                <div>
                  <p>H: {p.health}/{p.maxHealth}</p>
                  <p>E: {p.energy}/{p.maxEnergy}</p>
                </div>
              </div>
            )
          })}
        </div>
      }

    </div>
  )
}

export default Arena
