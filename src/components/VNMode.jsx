import '../css/VNMode.css'
import { useGameStore } from '../hooks/GameStore'
import Dialog from './Dialog'
import activitiesData from "../assets/data/activities.json"
import { useEffect, useState } from 'react'

function VNMode() {
  const dialog = useGameStore((state) => state.dialog)
  const day = useGameStore((state) => state.day)
  const location = useGameStore((state) => state.location)
  const [characterActivities, setCharacterActivities] = useState([])
  const [locationActivities, setLocationActivities] = useState([])

  // Get days activities
  useEffect(()=>{
    //const activities = activitiesData[location]
    const activities = activitiesData["hospital-room"]
    console.log(location, "hospital-room", location==="hospital-room", typeof(location))
    if (!activities) {
      console.log(activitiesData)
      console.warn("No activity data for location:", location)
      return
    }
    console.log(activities)
  }, [location])

  return (
    <div id='vn-mode'>

      {!dialog && 
      <div id='character-selection'>
        <img 
          id='character' 
          src='./characters/sofia-square.png'
        />
        <img 
          id='character' 
          src='./characters/sofia-square.png'
        />
      </div>}

      {dialog && <Dialog />}

    </div>
  )
}

export default VNMode
