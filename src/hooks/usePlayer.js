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
  allyRef,
  enemyRefs,
}) => {

  const damageEnemy = useCallback((eIndex, bio, type, amount, effect = null) => {
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

    bio.statusEffects.forEach(ef => {
      if (ef.type === "antibodies") dmg *= 2
    });

    bio.stats.health -= dmg
    let text = `${dmg.toFixed(0)} damage to ${bio.name}`

    if (bio.stats.health <= 0) {
      setSelectedEnemy(-1)
      text = `${bio.name} was killed!`
    }

    if (effect) {
      bio.statusEffects.push(effect)
    }

    // animate
    const enemyElement = enemyRefs.current[eIndex]
    if (enemyElement) {
      enemyElement.classList.remove('defend-anim')
      enemyElement.classList.remove('attack-anim')
      void enemyElement.offsetWidth
      enemyElement.classList.add('defend-anim')
    }
    if (allyRef.current) {
      allyRef.current.classList.remove('attack-anim')
      allyRef.current.classList.remove('defend-anim')
      void allyRef.current.offsetWidth
      allyRef.current.classList.add('attack-anim')
    }

    return [text, weak]
  }, [setSelectedEnemy])

  function settleActionCostAlly(bio, cost) {
    if (!cost) return true
    let tempHealth = bio.health
    let tempEnergy = bio.energy
    for (let i = 0; i < cost.length - 1; i += 2) {
      const [costName, costAmount] = [cost[i], cost[i + 1]];
      if (costName === "health") tempHealth -= costAmount;
      else if (costName === "energy") tempEnergy -= costAmount;
    }
    if (tempHealth > 0 && tempEnergy >= 0) {
      bio.health = tempHealth
      bio.energy = tempEnergy
    }
    else return false
    return true
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

    if (!settleActionCostAlly(member, action.cost)) {
      setTextInfo([{ character: "", text: "Cannot afford action" }])
      return
    }

    if (action.multi) {
      const tempText = []
      const tempWeaknesses = [...weaknesses]
      const tempEnemies = [...enemies]

      tempEnemies.forEach((en, index) => {
        const [text, weak] = damageEnemy(index, en, action.type, action.dmg, action.effect)
        tempWeaknesses[index][action.type] = weak
        if (text) tempText.push({ character: "", text })
      })

      tempText[tempText.length - 1].character = "turn end"
      setEnemies(tempEnemies)
      setWeaknesses(tempWeaknesses)
      setTextInfo(tempText)

    } else {
      const [text, weak] = damageEnemy(selectedEnemy, enemyBio, action.type, action.dmg, action.effect)
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

