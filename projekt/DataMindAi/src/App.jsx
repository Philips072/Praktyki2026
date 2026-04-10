import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomeHeader from './Components/HomeHeader'
import Home2 from './Components/Home2'
import Home1 from './Components/Home1'
import Home3 from './Components/Home3'
import Footer from './Components/Footer'
function App() {

  
  return (
    <BrowserRouter>
      <HomeHeader />
      <Home1 />
      <Home2 />
      <Home3 />
   
        {/* <Routes>

        </Routes> */}
      <Footer/>
    </BrowserRouter>
    
  )
}

export default App
