import { useEffect, useState, useRef } from 'react'
import '../css/Arena.css'
import { useGameStore } from '../hooks/GameStore'
import enemyData from '../assets/data/enemies.json'
import { useAI } from '../hooks/useAI'
import { usePlayer } from '../hooks/usePlayer'
import EnemyContainer from './EnemyContainer'
import PartyActions from './PartyActions'

function Arena() {
  const arena = useGameStore((state) => state.arena)
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

  const allyRef = useRef(null)
  const enemyRefs = useRef([])

  const { handleAiTurn } = useAI(
    bionas, 
    party, 
    partyStats, 
    setTextInfo, 
    setTurnIndex, 
    allyRef, 
    enemyRefs,
    setBionaImage,
  )
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
    allyRef,
    enemyRefs,
  })

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
      else {
        // show current player
        setBionaImage(bionas[turnIndex]["img-url"] + "idle.png")
      }
    }
    // enemy turn
    else {
      setTimeout(()=>handleAiTurn(enemies[turnIndex], turnIndex), 800)
    }
  }, [turnIndex])

  return (
    <div id='arena'>

      <EnemyContainer 
        enemies={enemies}
        selectedEnemy={selectedEnemy}
        setSelectedEnemy={setSelectedEnemy}
        weaknesses={weaknesses}
        turn={turn}
        enemyRefs={enemyRefs}
      />

      <PartyActions
        turn={turn}
        turnIndex={turnIndex}
        setTurnIndex={setTurnIndex}
        textInfo={textInfo}
        setTextInfo={setTextInfo}
        bionaImage={bionaImage}
        handleActionClick={handleActionClick}
        allyRef={allyRef}
      />

    </div>
  )
}

export default Arena
