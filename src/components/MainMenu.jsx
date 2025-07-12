
const styles = {
  "main-menu-container": {
    width: "100%",
    height: "100%",
    backgroundImage: "url(./locations/hospital-room.jpeg)",
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    alignItems: 'end',
    fontSize: "2rem",
    gap: '40px',
  }
}

function MainMenu({ setGameMode }) {
  const handleStoryClick = () => {
    setGameMode("story")
  }

  const handleBattleClick = () => {
    setGameMode("battle")
  }

  const handleResetClick = () => {
    localStorage.removeItem('game-storage')
    window.location.reload()
  }

  return (
    <div id='main-menu-container' style={styles["main-menu-container"]}>
      <button onClick={()=>handleStoryClick()}>Story</button>
      <button onClick={()=>handleBattleClick()}>Battle Mode</button>
      <button onClick={()=>handleResetClick()}>Reset Data</button>
    </div>
  )
}

export default MainMenu
