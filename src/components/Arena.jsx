import { useEffect, useState } from 'react'
import '../css/Arena.css'
import { useGameStore } from '../hooks/GameStore'
import enemyData from '../assets/data/enemies.json'
import { useAI } from '../hooks/useAI'
import { usePlayer } from '../hooks/usePlayer'
import { convertTypeNames } from '../utils/battleUtils'
import EnemyContainer from './EnemyContainer'

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
  const [bionaImage, setBionaImage] = useState(null)
  const [weaknesses, setWeaknesses] = useState([])
  const [selectedEnemy, setSelectedEnemy] = useState(0)

  const { handleActionClick } = usePlayer({
    bionas,
    party,
    partyStats,
    enemies,
    weaknesses,
    setEnemies,
    setWeaknesses,
    setTextInfo,
    setBionaImage,
    turnIndex,
    selectedEnemy,
    setSelectedEnemy,
    convertCharacterName,
  })
  const { handleAiTurn } = useAI(bionas, party, partyStats, setTextInfo, setTurnIndex)

  // load arena
  useEffect(()=>{
    if (arena.intro) setTextInfo(arena.intro)
    if (arena.enemies) {
      const tempEnemies = []
      const tempWeaknesses = []
      arena.enemies.forEach(en => {
        if (enemyData[en]) {
          // create a deep copy of enemy data
          tempEnemies.push(JSON.parse(JSON.stringify(enemyData[en])))
          tempWeaknesses.push({
            "ros" : null,
            "physical": null,
            "ph": null,
            "poison": null,
            "antibodies": null,
          })
        }
        else console.warn(`Couldn't find ${en} enemy data`, enemyData, en)
      })
      setEnemies(tempEnemies)
      setWeaknesses(tempWeaknesses)
      //console.log(tempEnemies, tempWeaknesses)
    }
    
  }, [arena])

  // handle team turns
  useEffect(()=>{
    setTurnIndex(0)
  }, [turn])

  // handle individual turns
  useEffect(()=>{
    // pass turn to other team if end of line reached
    if (!turn && turnIndex >= enemies.length) {
      setTurn(!turn)
      return
    }
    if (turn && turnIndex >= party.length) {
      setTurn(!turn)
      return
    }

    // check if all enemies dead
    let enemiesAlive = false
    enemies.forEach((e) => {
      if (e.stats.health > 0) enemiesAlive = true
    })
    if (!enemiesAlive && enemies.length > 0) {
      // stage cleared
      setTextInfo([
        {"character": "stage won", "text": "You did it!"}
      ])
    }

    // check if all allies dead
    let alliesAlive = false
    party.forEach((p) => {
      const member = partyStats[p]
      if (member.health > 0) alliesAlive = true
    })
    if (!alliesAlive && party.length > 0) {
      // stage lost
      setTextInfo([
        {"character": "stage lost", "text": "You were defeated!"}
      ])
    }

    // player turn
    if (turn) {
      const memberName = party[turnIndex]
      const member = partyStats[memberName]
      if (member.health <= 0) {
        // skip turn
        setTurnIndex(turnIndex + 1)
      }

      // show current player
      setBionaImage(bionas[turnIndex]["img-url"] + "idle.png")
    }
    // enemy turn
    else {
      setTimeout(()=>handleAiTurn(enemies[turnIndex], turnIndex), 800)
    }
  }, [turnIndex])

  const handleTextClick = () => {
    if (textInfo[0].character === "stage won") {
      setArena(null)
      return
    }
    if (textInfo[0].character === "stage lost") {
      setArena(null)
      return
    }
    if (textInfo[0].character === "turn end") setTurnIndex(turnIndex + 1)
    const tempTextInfo = [...textInfo]
    tempTextInfo.shift()
    setTextInfo(tempTextInfo)
  }

  return (
    <div id='arena'>

      <EnemyContainer 
        enemies={enemies}
        selectedEnemy={selectedEnemy}
        setSelectedEnemy={setSelectedEnemy}
        weaknesses={weaknesses}
        turn={turn}
      />

      <div id='party-container'>
        <img src={bionaImage} />
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
                      <p>{convertTypeNames(ba.type)}</p>
                      <p>{ba.dmg}</p>
                    </div>
                    {ba.cost?.map((c, i) => {
                      if (i%2===0) return null
                      const costType = ba.cost[i-1]
                      const costAmount = c
                      return (<p key={i} style={{color:'red'}}>{`${costType} - ${costAmount}`}</p>)
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
                  <div>
                    <p style={{color: "green"}}>H: {p.health}/{p.maxHealth}</p>
                    <p style={{color: "yellow"}}>E: {p.energy}/{p.maxEnergy}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      }

    </div>
  )
}

export default Arena
