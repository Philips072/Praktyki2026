import './TestPage.css'
import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import Test from '../Components/Test'

function TestPage() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 640)

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <Test />
    </SidebarHeader>
  )
}

export default TestPage
