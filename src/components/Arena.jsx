import { useEffect, useState } from 'react'
import '../css/Arena.css'
import { useGameStore } from '../hooks/GameStore'
import enemyData from '../assets/data/enemies.json'

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
      setTimeout(()=>handleAiTurn(), 800)
    }
  }, [turnIndex])

  const handleAiTurn = () => {
    const ai = enemies[turnIndex]
    if (!ai) {
      console.warn("couldn't find enemy at", turnIndex)
      setTurnIndex(turnIndex+1)
    }
    if (ai.stats.health <= 0) setTurnIndex(turnIndex+1)

    //console.log("Ais turn:", ai)
    const action = selectAiAction(ai)
    const playerIndex = selectAiTarget()
    //const member = party[playerIndex]
    //const biona = bionas[playerIndex]

    if (action?.multi === true) {
      // attack all players
      const tempTextInfo = []
      bionas.forEach((b,i) => {
        const text = damagePlayer(i, action.type, action.dmg)
        tempTextInfo.push({"character": "", "text": text})
      })
      tempTextInfo[tempTextInfo.length-1].character = "turn end"
      setTextInfo(tempTextInfo)
    }
    if (action.type === "skip") {
      // skip turn
      const text = `${ai.name} skipped there turn.`
      setTextInfo([
        {"character": "turn end", "text": text}
      ])
    }
    else {
      // attack single player
      const text = damagePlayer(playerIndex, action.type, action.dmg)
      setTextInfo([
        {"character": "turn end", "text": text}
      ])
    }
  }

  const selectAiAction = (ai) => {
    // Select action at random, if that fails, do action at slot zero, else defend / skip turn
    const chance = Math.floor(Math.random() * ai.actions.length)
    let chosenAction = ai.actions[chance]
    let canAfford = true
    if (chosenAction.cost) {
      chosenAction.cost.forEach((cost, i) => {
        if (cost === "health" && ai.stats.health <= chosenAction.cost[i+1]) canAfford = false
        else if (cost === "energy" && ai.stats.energy <= chosenAction.cost[i+1]) canAfford = false
      });
    }

    if (canAfford) return chosenAction

    // default to first action
    chosenAction = ai.actions[0]
    canAfford = true
    if (chosenAction.cost) {
      chosenAction.cost.forEach((cost, i) => {
        if (cost === "health" && ai.stats.health <= chosenAction.cost[i+1]) canAfford = false
        else if (cost === "energy" && ai.stats.energy <= chosenAction.cost[i+1]) canAfford = false
      });
    }
    if (canAfford) return chosenAction

    // skip turn
    return { type: "skip" }
  }
  
  const selectAiTarget = () => {
    // Pick target at random who is alive
    const aliveIndicies = []
    bionas.forEach((b,i) => {
      if (b.health <= 0) return
      aliveIndicies.push(i)
    });
    const index = Math.floor(Math.random() * aliveIndicies.length)
    const chosen = aliveIndicies[index]

    return chosen
  }

  const damagePlayer = (index, type, amount) => {
    // Ai attacks player
    const member = partyStats[party[index]]
    const biona = bionas[index]

    if (member.health <= 0) return null
    //console.log("damaging:", member, biona)

    let dmg = amount
    if (biona.weaknesses.includes(type)) {
      dmg *= 3
    }
    else if (biona.strengths.includes(type)) {
      dmg *= 0.35
    }
    member.health -= dmg
    let text = `Enemy hit ${biona.name} for ${dmg} (${member.health})`

    if (member.health <= 0) {
      text = `Enemy killed ${biona.name}!`
      member.health = 0
    }

    setBionaImage(biona["img-url"] + "defend.png")

    return text
  }

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

  const handleActionClick = (action) => {
    if (selectedEnemy === -1) {
      setTextInfo([{"character": "", "text": "Select an enemy"}])
      return
    }
    const enemyBio = enemies[selectedEnemy]
    if (!enemyBio) {
      console.warn("Couldn't find selected enemy:", enemies, selectedEnemy)
      return
    }
    const member = partyStats[party[turnIndex]]
    //console.log("action clicked:", action)

    setBionaImage(bionas[turnIndex]["img-url"] + "attack.png")
    settleActionCostAlly(member, action.cost)

    if (action.multi) {
      const tempText = []
      const tempWeaknesses = [...weaknesses]
      enemies.forEach((en,index) => {
        const [text, weak] = damageEnemy(en, action.type, action.dmg)
        tempWeaknesses[index][action.type] = weak
        tempText.push({"character": "", "text": text})
      })
      setWeaknesses(tempWeaknesses)
      tempText[tempText.length-1].character = "turn end"
      setTextInfo(tempText)
    }
    else {
      const [text, weak] = damageEnemy(enemyBio, action.type, action.dmg)
      const tempWeaknesses = [...weaknesses]
      tempWeaknesses[selectedEnemy][action.type] = weak
      setWeaknesses(tempWeaknesses)
      setTextInfo([
        {"character": "turn end", "text": text}
      ])
    }
  }

  const settleActionCostAlly = (bio, cost) => {
    if (!cost) return
    //console.log("settling action cost:", bio)
    for (let i = 0; i < cost.length-1; i+=2) {
      const costName = cost[i];
      const costAmount = cost[i+1]
      if (costName === "health") {
        bio.health -= costAmount
      }
      else if (costName === "energy") {
        bio.energy -= costAmount
      }
    }
  }

  const damageEnemy = (bio, type, amount) => {
    if (bio.stats.health <= 0) return null
    //console.log("damaging:", bio)

    let dmg = amount
    let weak = null
    if (bio.weaknesses.includes(type)) {
      dmg *= 3
      weak = "weak"
    }
    else if (bio.strengths.includes(type)) {
      dmg *= 0.35
      weak = "str"
    }
    else {
      weak = "-"
    }
    bio.stats.health -= dmg
    let text = `${bio.name} was hit for ${dmg} (${bio.stats.health})`

    if (bio.stats.health <= 0) {
      setSelectedEnemy(-1)
      text = `${bio.name} was killed!`
    }

    return [text, weak]
  }

  return (
    <div id='arena'>

      <div id='enemy-container'>
        {enemies.map((en, i) => {
          if (en.stats.health <= 0) return null
          return (
            <img 
              key={"enemy"+i} 
              src={en["img-url"]+"idle.png"} 
              className={selectedEnemy === i && turn ? "selected" : ""}
              onClick={()=>setSelectedEnemy(i)}
            />
          )
        })}
        {turn && selectedEnemy !=-1 && weaknesses[selectedEnemy] && Object.keys(weaknesses[selectedEnemy]).length > 0 &&
          <div id='weaknesses'>
            {Object.keys(weaknesses[selectedEnemy]).map((weakName, i) => {
              const weak = weaknesses[selectedEnemy][weakName]
              return (
              <div key={weakName+selectedEnemy+i}>
                <p>{convertTypeNames(weakName)}</p>
                <p>{weak===null ? "null" : weak}</p>
              </div>)
            })}
          </div>
        }
      </div>

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

function convertTypeNames(tName) {
  if (tName === "ros") return "ROS"
  if (tName === "physical") return "SLASH"
  if (tName === "ph") return "PH"
  if (tName === "poison") return "POISON"
  if (tName === "antibodies") return "Anti-B"
  return tName
}

export default Arena
