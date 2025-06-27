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


