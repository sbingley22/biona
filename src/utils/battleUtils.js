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
