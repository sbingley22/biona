import '../css/toolbar.css'
import { useGameStore } from '../hooks/GameStore'
import { useState } from 'react'

function Toolbar() {
  const toolbarVisible = useGameStore((state) => state.toolbarVisible)
  const moveLocation = useGameStore((state) => state.moveLocation)
  const [containerOpen, setContainerOpen] = useState(false)
  const [subMenu, setSubMenu] = useState(null)

  const handleOpenerClick = () => {
    setSubMenu(null)
    setContainerOpen(!containerOpen)
  }

  return (
    <div id='toolbar' className={toolbarVisible ? '' : 'hidden'}>
      <div id='sub' className={subMenu ? 'show' : ''}>
        <div id='locations' className={subMenu==='locations' ? 'show' : ''}>
          <button onClick={()=>moveLocation('hospital-room')}>Room</button>
          <button onClick={()=>moveLocation('hospital-garden')}>Garden</button>
        </div>
      </div>
      <div id='main'>
        <div id='opener' onClick={handleOpenerClick}></div>
        <div id='container' className={containerOpen ? '' : 'hidden'}>
          <button onClick={()=>setSubMenu('locations')}>Location</button>
          <button>Options</button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
