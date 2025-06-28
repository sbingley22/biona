export const useAI = (bionas, party, partyStats, setTextInfo, setTurnIndex) => {
  const handleAiTurn = (ai, index) => {
    if (!ai || ai.stats.health <= 0) {
      setTurnIndex(index + 1)
      return
    }
    const action = selectAiAction(ai)
    const playerIndex = selectAiTarget()

    if (action.type === "skip") {
      setTextInfo([{ character: "turn end", text: `${ai.name} skipped their turn.` }])
    } else if (action.multi) {
      const info = bionas.map((_, i) => ({
        character: "",
        text: damagePlayer(i, action.type, action.dmg, ai.name)
      }))
      info[info.length - 1].character = "turn end"
      setTextInfo(info)
    } else {
      const text = damagePlayer(playerIndex, action.type, action.dmg, ai.name)
      setTextInfo([{ character: "turn end", text }])
    }
  }

  const damagePlayer = (index, type, amount, name) => {
    const member = partyStats[party[index]]
    const biona = bionas[index]
    if (member.health <= 0) return null

    let dmg = amount
    if (biona.weaknesses.includes(type)) dmg *= 3
    else if (biona.strengths.includes(type)) dmg *= 0.35

    member.health -= dmg
    const text = member.health <= 0
      ? `${name} killed ${biona.name}!`
      : `${name} hit ${biona.name} for ${dmg} (${member.health})`

    if (member.health <= 0) member.health = 0
    return text
  }

  const selectAiAction = (ai) => {
    let action = ai.actions[Math.floor(Math.random() * ai.actions.length)] || ai.actions[0]
    if (!canAfford(ai, action)) action = ai.actions[0]
    if (!canAfford(ai, action)) return { type: "skip" }
    return action
  }

  const canAfford = (ai, action) => {
    if (!action.cost) return true
    for (let i = 0; i < action.cost.length - 1; i += 2) {
      const [type, amount] = [action.cost[i], action.cost[i + 1]]
      if (type === "health" && ai.stats.health <= amount) return false
      if (type === "energy" && ai.stats.energy <= amount) return false
    }
    return true
  }

  const selectAiTarget = () => {
    const aliveIndices = party.map((m, i) => partyStats[m].health > 0 ? i : -1).filter(i => i !== -1)
    return aliveIndices[Math.floor(Math.random() * aliveIndices.length)]
  }

  return { handleAiTurn }
}

