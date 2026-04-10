import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomeHeader from './Components/HomeHeader'
import Home2 from './Components/Home2'

function App() {

  
  return (
    <BrowserRouter>
      <HomeHeader />
      <Home2 />
        {/* <Routes>

        </Routes> */}
    </BrowserRouter>
  )
}

export default App
