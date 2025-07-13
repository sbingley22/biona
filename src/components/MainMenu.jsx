import { useState } from "react"

const styles = {
  "main-menu-container": {
    width: "100%",
    height: "100%",
    backgroundImage: "url(./locations/hospital-room.jpeg)",
    backgroundSize: 'cover',
  },
  "menu-buttons": {
    width: "100%",
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'end',
    fontSize: "1.6rem",
    gap: '40px',
    padding: '10px',
  },
  "how-to-play": {
    width: '100%',
    height: '100%',
    padding: '20px',
    margin: 0,
    background: 'rgba(0,0,0,0.8)',
    color: '#FA5',
    fontSize: '1.2rem',
    overflowY: 'auto',
  }
}

function MainMenu({ setGameMode }) {
  const [howToPlay, setHowToPlay] = useState(false)

  const handleStoryClick = () => {
    setGameMode("story")
  }

  const handleBattleClick = () => {
    setGameMode("battle")
  }

  const handleHowToClick = () => {
    setHowToPlay(true)
  }

  const handleResetClick = () => {
    localStorage.removeItem('game-storage')
    window.location.reload()
  }

  const returnToMain = () => {
    setHowToPlay(false)
  }

  return (
    <div id='main-menu-container' style={styles["main-menu-container"]}>
      {howToPlay ?
        <div style={styles['how-to-play']}>
          <button onClick={()=>returnToMain()}>RETURN</button>
          <h3 style={{ margin: 20, color: 'purple' }}>Story</h3>
          <p>The story mode of biona is about reading dialog, exploring the hospital, training and equiping your character, and ultimately fighting battles in each patients biona to help them break free of there health condition.</p>
          <p>The game saves automatically.</p>
          <p>You can only do one event (talking to a character, fighting a battle, etc) per day. Before needing to sleep.</p>
          <p></p>

          <h3 style={{ margin: 20, color: 'purple' }}>Battle</h3>
          <p>Selecting battle mode puts you in a survival mode with the characters you have collected from story mode. Leveling up here also levels up your bionas in story mode.</p>
          <p>Battles also occur in story mode. You must complete every arena to finish that arch of the story</p>
          <p>Each party member gets a turn in order. Each turn you can either use an action, use an item, or skip.</p>
          <p>Right clicking, or touch holding an action card will give you more details about its action.</p>
          <p>Enemies have weakness to certain types of action elements. Attack an enemy and it will reveal if they are weak strong or neutral against that element.</p>
          <p>In story mode failing an arena means you get to try again with full health. In survival mode your run is over.</p>
          <p>You can use items to cure yourself of status effects. For example poison makes you miss a turn. If another party member uses antidote then all party members effected by poison will be cured.</p>
        </div>
        :
        <div id="menu-buttons" style={styles["menu-buttons"]}>
          <h1 style={{ margin: 0, padding: '20px' }}>Biona</h1>
          <button onClick={()=>handleStoryClick()}>Story</button>
          <button onClick={()=>handleBattleClick()}>Battle Mode</button>
          <button onClick={()=>handleHowToClick()}>How to Play</button>
          <button onClick={()=>handleResetClick()}>Reset Data</button>
        </div>
      }
    </div>
  )
}

export default MainMenu
