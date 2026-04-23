import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import TestSolve from '../Components/TestSolve'

function TestSolvePage() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 640)

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <TestSolve />
    </SidebarHeader>
  )
}

export default TestSolvePage
