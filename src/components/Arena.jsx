import { useEffect, useState } from 'react'
import '../css/Arena.css'
import { useGameStore } from '../hooks/GameStore'
import enemyData from '../assets/data/enemies.json'
import allyData from '../assets/data/allies.json'

function Arena() {
  const arena = useGameStore((state) => state.arena)
  const setArena = useGameStore((state) => state.setArena)
  const convertCharacterName = useGameStore((state) => state.convertCharacterName)

  const [turn, setTurn] = useState(true)
  const [turnIndex, setTurnIndex] = useState(0)
  const [textInfo, setTextInfo] = useState([])
  const [enemies, setEnemies] = useState([])

  // load arena
  useEffect(()=>{
    console.log(arena)
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

  }, [turn])

  // handle individual turns
  useEffect(()=>{

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
        turn && <div id='party-actions'>
        </div>
      }

    </div>
  )
}

export default Arena
