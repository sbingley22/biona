import { useGameStore } from '../hooks/GameStore'
import { useRef } from 'react'

const styles = {
  overlay: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    left: 0,
    top: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    background: "#222",
    minWidth: "60vw",
    minHeight: "60vh",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    gap: '20px',
    padding: '20px',
  }
}

function Options ({ setShowOptions }) {
  const devMode = useGameStore((state) => state.devMode)
  const setDevMode = useGameStore((state) => state.setDevMode)
  const setDay = useGameStore((state) => state.setDay)

  const inputRef = useRef(null)

  const handleResetClick = () => {
    localStorage.removeItem('game-storage')
    window.location.reload()
  }

  const handleCheatChange = (e) => {
    setDevMode(e.target.checked)
  }

  const changeDay = () => {
    const dayValue = parseInt(inputRef.current?.value, 10)
    if (!isNaN(dayValue)) {
      setDay(dayValue)
    } else {
      console.warn("Invalid day value")
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2>Options</h2>

        <button onClick={()=>handleResetClick()}>Reset Data</button>

        <label>
          <input 
            type='checkbox'
            checked={devMode}
            onChange={(e)=>handleCheatChange(e)}
          />
          Cheat Mode
        </label>

        {devMode && <label>Day: <input ref={inputRef} type='number' /></label>}

        {devMode && <button onClick={()=>changeDay()}>ChangeDay</button>}

        <button onClick={()=>setShowOptions(false)}>Return</button>
      </div>
    </div>
  )
}

export default Options
