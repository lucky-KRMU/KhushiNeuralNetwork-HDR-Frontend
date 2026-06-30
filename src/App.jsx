import { useState } from 'react'
import Header from './Components/Header/Header'
import Playground from './Components/Playground/Playground'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Playground />
    </>
  )
}

export default App
