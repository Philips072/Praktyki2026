import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomeHeader from './Components/HomeHeader'
import Home2 from './Components/Home2'
import Home1 from './Components/Home1'
import Home3 from './Components/Home3'
import Footer from './Components/Footer'
import SidebarHeader from './Components/SidebarHeader'
import HomePage from './Pages/HomePage'

import Dashboard1 from './Components/Dashboard1'
import Dashboard2 from './Components/Dashboard2'
import HomePage from './Pages/HomePage'
import DashboardPage from './Pages/DashboardPage'
function App() {

  
  return (
    <BrowserRouter>
      {/* <HomePage /> */}
        <DashboardPage />

        {/* <Routes>

        </Routes> */}
      {/* <Footer/> */}


          {/* <Dashboard1 />
          <Dashboard2 /> */}

    <HomePage/>

    </BrowserRouter>
    
  )
}

export default App
