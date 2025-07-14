export const defaultPartyStats = {
  'sean': {
    biona: "nk-cell",
    level: 1,
    health: 120,
    maxHealth: 120,
    energy: 40,
    maxEnergy: 40,
    nerfs: [],
    buffs: [],
    statusEffects: [],
  },
  'sofia': {
    biona: "b-cell",
    level: 1,
    health: 105,
    maxHealth: 105,
    energy: 60,
    maxEnergy: 60,
    nerfs: [],
    buffs: [],
    statusEffects: [],
  },
  'boy': {
    biona: "t-cell",
    level: 1,
    health: 110,
    maxHealth: 110,
    energy: 60,
    maxEnergy: 60,
    nerfs: [],
    buffs: [],
    statusEffects: [],
  },
}

export function convertTypeNames(tName) {
  const map = {
    ros: "ROS",
    physical: "SLASH",
    ph: "PH",
    poison: "POISON",
    antibodies: "Anti-B"
  }
  return map[tName] || tName
}

export function findNonMatchingStrings(arr1, arr2) {
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)

  const uniqueToArr1 = arr1.filter(str => !set2.has(str))
  const uniqueToArr2 = arr2.filter(str => !set1.has(str))

  return [...new Set([...uniqueToArr1, ...uniqueToArr2])]
}
