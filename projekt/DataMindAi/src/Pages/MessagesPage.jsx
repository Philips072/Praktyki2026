import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import Messages from '../Components/Messages'

function MessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 640)

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} noPadding>
      <Messages />
    </SidebarHeader>
  )
}

export default MessagesPage
