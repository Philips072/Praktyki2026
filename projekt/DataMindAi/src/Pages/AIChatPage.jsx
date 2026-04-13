import './AIChatPage.css'
import { Link } from 'react-router-dom'
import AiChat from '../Components/AiChat'
import SidebarHeader from '../Components/SidebarHeader'
import { useState } from 'react'

function AIChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
  
  return (
    <>
     <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <AiChat />
        </SidebarHeader>
    
  
    </>
  )
}

export default AIChatPage