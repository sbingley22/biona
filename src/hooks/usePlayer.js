import { useCallback } from 'react'

export const usePlayer = ({
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
}) => {

  const damageEnemy = useCallback((bio, type, amount) => {
    if (bio.stats.health <= 0) return [null, null]

    let dmg = amount
    let weak = null

    if (bio.weaknesses.includes(type)) {
      dmg *= 3
      weak = "weak"
    } else if (bio.strengths.includes(type)) {
      dmg *= 0.35
      weak = "str"
    } else {
      weak = "-"
    }

    bio.stats.health -= dmg
    let text = `${bio.name} was hit for ${dmg.toFixed(1)} (${bio.stats.health.toFixed(1)})`

    if (bio.stats.health <= 0) {
      setSelectedEnemy(-1)
      text = `${bio.name} was killed!`
    }

    return [text, weak]
  }, [setSelectedEnemy])

  function settleActionCostAlly(bio, cost) {
    if (!cost) return;
    for (let i = 0; i < cost.length - 1; i += 2) {
      const [costName, costAmount] = [cost[i], cost[i + 1]];
      if (costName === "health") bio.health -= costAmount;
      if (costName === "energy") bio.energy -= costAmount;
    }
  }

  const handleActionClick = useCallback((action) => {
    if (selectedEnemy === -1) {
      setTextInfo([{ character: "", text: "Select an enemy" }])
      return
    }

    const enemyBio = enemies[selectedEnemy]
    if (!enemyBio) {
      console.warn("Couldn't find selected enemy:", enemies, selectedEnemy)
      return
    }

    const member = partyStats[party[turnIndex]]
    setBionaImage(bionas[turnIndex]["img-url"] + "attack.png")

    settleActionCostAlly(member, action.cost)

    if (action.multi) {
      const tempText = []
      const tempWeaknesses = [...weaknesses]
      const tempEnemies = [...enemies]

      tempEnemies.forEach((en, index) => {
        const [text, weak] = damageEnemy(en, action.type, action.dmg)
        tempWeaknesses[index][action.type] = weak
        if (text) tempText.push({ character: "", text })
      })

      tempText[tempText.length - 1].character = "turn end"
      setEnemies(tempEnemies)
      setWeaknesses(tempWeaknesses)
      setTextInfo(tempText)

    } else {
      const [text, weak] = damageEnemy(enemyBio, action.type, action.dmg)
      const tempWeaknesses = [...weaknesses]
      tempWeaknesses[selectedEnemy][action.type] = weak

      setWeaknesses(tempWeaknesses)
      setEnemies([...enemies])
      setTextInfo([{ character: "turn end", text }])
    }
  }, [
    selectedEnemy, enemies, partyStats, party, turnIndex,
    weaknesses, setTextInfo, setBionaImage, setEnemies,
    damageEnemy, setWeaknesses, bionas
  ])

  return { handleActionClick }
}

