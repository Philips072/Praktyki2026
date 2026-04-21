import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import Sandbox from '../Components/Sandbox'

function SandboxPage() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 640)

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <Sandbox />
    </SidebarHeader>
  )
}

export default SandboxPage
