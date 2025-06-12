import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Hello! This app works offline after first visit.')

  useEffect(() => {
    console.log('App mounted')
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Offline React App</h1>
      <p>{message}</p>
    </div>
  )
}

export default App
