import '../css/toolbar.css'
import { useGameStore } from '../hooks/GameStore'
import { useState } from 'react'

function Toolbar() {
  const toolbarVisible = useGameStore((state) => state.toolbarVisible)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const getLocations = useGameStore((state) => state.getLocations)
  const dialog = useGameStore((state) => state.dialog)
  const mode = useGameStore((state) => state.mode)
  const devMode = useGameStore((state) => state.devMode)
  const [containerOpen, setContainerOpen] = useState(false)
  const [subMenu, setSubMenu] = useState(null)

  let showToolbar = true
  if (dialog) showToolbar = false
  if (mode === 'battle') showToolbar = false

  const handleOpenerClick = () => {
    setSubMenu('locations')
    if (containerOpen) {
      setSubMenu(null)
    }
    setContainerOpen(!containerOpen)
  }

  const closeToolbar = () => {
    setSubMenu(null)
    setContainerOpen(false)
  }

  const handleLocationClick = (loc) => {
    closeToolbar()
    moveLocation(loc)
  }

  const handleReset = () => {
    localStorage.removeItem('game-storage')
    window.location.reload()
  }

  return (
    <>
    {showToolbar && <div id='toolbar' className={toolbarVisible ? '' : 'hidden'}>
      <div id='sub' className={subMenu ? 'show' : ''}>
        <div id='locations' className={subMenu==='locations' ? 'show' : ''}>
          {getLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocationClick(loc)}
            >{formatString(loc, "hospital")}</button>
          ))}
        </div>
      </div>
      <div id='main'>
        <div id='opener' onClick={handleOpenerClick}></div>
        <div id='container' className={containerOpen ? '' : 'hidden'}>
          <button onClick={()=>setSubMenu('locations')}>Locations</button>
          <button>Inventory</button>
          <button>Options</button>
          {devMode && <button onClick={()=>handleReset()}>Reset Store</button>}
        </div>
      </div>
    </div>}
    </>
  )
}

function formatString(str, wordToRemove) {
  const regex = new RegExp(`\\b${wordToRemove}\\b`, 'gi')
  let result = str.replace(regex, '')
  result = result.replace(/-/g, ' ')
  result = result.replace(/\b(\w)/g, char => char.toUpperCase())
  return result.replace(/\s+/g, ' ').trim()
}

export default Toolbar
