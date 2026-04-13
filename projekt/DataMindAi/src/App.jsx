import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import DashboardPage from './Pages/DashboardPage'

function App() {

  
  return (
    <BrowserRouter>
      {/* <HomePage /> */}
        <DashboardPage />

        {/* <Routes>

        </Routes> */}


      

    <HomePage/>

    </BrowserRouter>
    
  )
}

export default App
