import '../css/toolbar.css'
import { useGameStore } from '../hooks/GameStore'
import { useState} from 'react'
import Options from './Options'

function Toolbar({ setGameMode }) {
  const toolbarVisible = useGameStore((state) => state.toolbarVisible)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const getLocations = useGameStore((state) => state.getLocations)
  const dialog = useGameStore((state) => state.dialog)
  const mode = useGameStore((state) => state.mode)

  const [containerOpen, setContainerOpen] = useState(false)
  const [subMenu, setSubMenu] = useState(null)
  const [showOptions, setShowOptions] = useState(false)

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

  const handleRestart = () => {
    setGameMode('main-menu')
  }

  const handleOptionsClick = () => {
    setShowOptions(true)
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
          {/* <button onClick={()=>setSubMenu('locations')}>Locations</button> */}
          <button onClick={()=>handleOptionsClick()}>Options</button>
          <button onClick={()=>handleRestart()}>Restart</button>
        </div>
      </div>

      {showOptions && <Options setShowOptions={setShowOptions} />}
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
