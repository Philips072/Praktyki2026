import './HomePage.css'
import { Link } from 'react-router-dom'
import HomeHeader from '../Components/HomeHeader'
import Home1 from '../Components/Home1'
import Home2 from '../Components/Home2'
import Home3 from '../Components/Home3'
import Home4 from '../Components/Home4'
import Footer from '../Components/Footer'

function HomePage() {
  
  return (
    <div className="home-page">
        <HomeHeader/>
        <div className="home-page-content">
            <Home1/>
            <Home2/>
            <Home3/>
            <Home4/>
        </div>
        <Footer/>
    </div>
  )
}

export default HomePage