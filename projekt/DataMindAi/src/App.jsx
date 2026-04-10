import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomeHeader from './Components/HomeHeader'
import Home2 from './Components/Home2'
import Home3 from './Components/Home3'
import Home4 from './Components/Home4'
import Footer from './Components/Footer'

function App() {

  
  return (
    <BrowserRouter>
      <HomeHeader />
        <Register />
        {/* <Routes>

        </Routes> */}
      <Footer/>
    </BrowserRouter>
    
  )
}

export default App
