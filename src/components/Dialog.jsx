import { useEffect, useState } from 'react'
import '../css/Dialog.css'
import { useGameStore } from '../hooks/GameStore'
import characterData from '../assets/data/characters.json'

function Dialog() {
  const dialog = useGameStore((state) => state.dialog)
  const setDialog = useGameStore((state) => state.setDialog)
  const [dialogIndex, setDialogIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const setBackground = useGameStore((state) => state.setBackground)
  const handleAction = useGameStore((state) => state.handleAction)

  useEffect(()=>{
    if (!dialog) return
    if (dialog[0].background) setBackground(dialog[0].background)
  }, [dialog])

  const handleTextClick = () => {
    // go to next line of text
    let index = textIndex + 1
    if (index < dialog[dialogIndex].text.length) {
      setTextIndex(index)
      return
    }

    // reached end of current text
    setTextIndex(0)

    // see to any actions
    if (dialog[dialogIndex].actions) {
      dialog[dialogIndex].actions.forEach((action) => {
        //doAction(action)
        handleAction(action)
      })
    }

    // try to move to next character in dialog
    let tempDialogIndex = dialogIndex + 1
    if (tempDialogIndex < dialog.length) {
      setDialogIndex(tempDialogIndex)
      if (dialog[tempDialogIndex].background) setBackground(dialog[tempDialogIndex].background)
      return
    }

    // reached end of dialog
    setDialogIndex(0)
    setDialog(null)
  }

  const currentDialog = dialog[dialogIndex]
  const currentText = currentDialog.text[textIndex]
  const currentCharacter = characterData[currentDialog.character][currentDialog.emotion]

  return (
    <div id='dialog-container' onClick={handleTextClick}>
      <img id='character-image' src={currentCharacter} />
      <div id='text-container'>
        <p>{currentText}</p>
      </div>
    </div>
  )
}

export default Dialog
