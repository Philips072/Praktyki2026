import './LecturesPage.css'
import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import Lectures from '../Components/Lectures'

function LecturesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 640)

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <Lectures />
    </SidebarHeader>
  )
}

export default LecturesPage
