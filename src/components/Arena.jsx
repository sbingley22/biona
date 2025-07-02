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
  const setPartyStats = useGameStore((state) => state.setPartyStats)
  const bionas = useGameStore((state) => state.bionas)
  const convertCharacterName = useGameStore((state) => state.convertCharacterName)

  const [totalTurns, setTotalTurns] = useState(0)
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

    setTotalTurns(totalTurns+1)

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
        handleStatusEffects(true)
      }
    }
    // enemy turn
    else {
      setTimeout(()=>{
        handleStatusEffects(false)
        handleAiTurn(enemies[turnIndex], turnIndex)
      }, 800)
    }
  }, [turnIndex])

  const handleStatusEffects = (ally=true) => {
    if (totalTurns === 0) return // skip so you don't die immidiately

    // set member diferently if ally or not
    const memberName = ally ? convertCharacterName(party[turnIndex]) : enemies[turnIndex].name
    const member = ally
      ? {...partyStats[party[turnIndex]]} 
      : {...enemies[turnIndex], stats: {...enemies[turnIndex].stats}}

    console.log(memberName, member, member.statusEffects)
    //if (memberName === "Sofia" && member.statusEffects.length > 0) debugger
    if (!member.statusEffects) return

    const tempTextInfo = []
    const updatedEffects = member.statusEffects
      .map(effect => {
        if (effect.turns < 1) return effect // Keep as-is for filtering
        if (["poison", "antibodies", "ros", "ph"].includes(effect.type)) {
          if (ally) {
            member.health -= effect.dmg
            tempTextInfo.push({ character: "", text: `${memberName} took ${effect.dmg} ${effect.type} damage` })
          } else {
            member.stats.health -= effect.dmg
          }
        }
        return { ...effect, turns: effect.turns - 1 }
      })
      .filter(effect => effect.turns > 0) // ⬅️ remove expired effects
    member.statusEffects = updatedEffects

    if (tempTextInfo.length > 0) setTextInfo(tempTextInfo)

    if (ally) {
      setPartyStats({
        ...partyStats,
        [memberName]: member
      })
    }
    else {
      const tempEnemies = [...enemies]
      tempEnemies[turnIndex] = member
      setEnemies(tempEnemies)
    }
  }

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
