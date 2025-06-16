import '../css/VNMode.css'
import { useGameStore } from '../hooks/GameStore'
import Dialog from './Dialog'
import activitiesData from "../assets/data/activities.json"
import characterData from "../assets/data/characters.json"
import { useEffect, useState } from 'react'

function VNMode() {
  const dialog = useGameStore((state) => state.dialog)
  const day = useGameStore((state) => state.day)
  const location = useGameStore((state) => state.location)
  const handleAction = useGameStore((state) => state.handleAction)
  const [characterActivities, setCharacterActivities] = useState([])
  const [locationActivities, setLocationActivities] = useState([])

  // Get days activities
  useEffect(()=>{
    const activities = activitiesData[location]
    if (!activities) {
      console.warn("No activity data for location:", location)
      return
    }

    const tempCharacterActivities = []
    const tempLocationActivities = []

    activities.forEach((activity) => {
      let dayConditionMet = false
      activity?.conditions?.days?.forEach(d => {
        if (day >= d[0] && day < d[1]) dayConditionMet = true
      })
      activity?.conditions?.["days-off"]?.forEach(d => {
        if (day >= d[0] && day < d[1]) dayConditionMet = false
      })
      if (dayConditionMet === false) return

      if (activity.type === "social-link") {
        tempCharacterActivities.push(activity)
      }
      else {
        tempLocationActivities.push(activity)
      }
    })

    setCharacterActivities(tempCharacterActivities)
    setLocationActivities(tempLocationActivities)
  }, [location])

  const handleActivity = (activity) => {
    activity.actions.forEach((action) => handleAction(action))
  }

  return (
    <div id='vn-mode'>

      {!dialog && 
      <div id='activity-selection'>
        {characterActivities.map((ca) => {
          const charInfo = characterData[ca.character]
          if (ca.type === "social-link") {
            return (
              <img
                key={ca.activity}
                className='character'
                src={charInfo?.square || "./characters/sofia-square.png"}
              />
            )
          }
        })}      
        {locationActivities.map((la) => (
          <button
            key={la.activity}
            className='activity-btn'
            onClick={()=>handleActivity(la)}
          >
            {la.name}
          </button>
        ))}
      </div>}

      {dialog && <Dialog />}

    </div>
  )
}

export default VNMode
