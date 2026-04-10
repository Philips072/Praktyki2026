import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomeHeader from './Components/HomeHeader'
import Home2 from './Components/Home2'
import Home1 from './Components/Home1'

function App() {

  
  return (
    <BrowserRouter>
      <HomeHeader />
      <Home1 />
      <Home2 />
        {/* <Routes>

        </Routes> */}
      <Footer/>
    </BrowserRouter>
    
  )
}

export default App
