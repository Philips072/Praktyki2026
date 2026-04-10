import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomeHeader from './Components/HomeHeader'
import Home2 from './Components/Home2'
import Home3 from './Components/Home3'
import Home4 from './Components/Home4'

function App() {

  
  return (
    <BrowserRouter>
      <HomeHeader />
      <Home2 />
      <Home3 />
      <Home4 />
        {/* <Routes>

        </Routes> */}
    </BrowserRouter>
  )
}

export default App
