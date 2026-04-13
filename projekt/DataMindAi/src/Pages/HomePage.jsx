import './HomePage.css'
import { useState } from 'react'
import HomeHeader from '../Components/HomeHeader'
import SidebarHeader from '../Components/SidebarHeader'
import AnimateOnScroll from '../Components/AnimateOnScroll'
import Home1 from '../Components/Home1'
import Home2 from '../Components/Home2'
import Home3 from '../Components/Home3'
import Home4 from '../Components/Home4'
import Footer from '../Components/Footer'
import { useAuth } from '../AuthContext'

function HomePage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 640)

  const content = (
    <>
      <div className="home-page-content">
        <AnimateOnScroll><Home1 /></AnimateOnScroll>
        <Home2 />
        <Home3 />
        <AnimateOnScroll><Home4 /></AnimateOnScroll>
      </div>
      <Footer />
    </>
  )

  if (user) {
    return (
      <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} noPadding>
        {content}
      </SidebarHeader>
    )
  }

  return (
    <div className="home-page">
      <HomeHeader />
      {content}
    </div>
  )
}

export default HomePage