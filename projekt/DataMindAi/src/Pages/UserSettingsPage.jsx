import './UserSettingsPage.css'
import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import UserSettings from '../Components/UserSettings'

function UserSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <UserSettings />
    </SidebarHeader>
  )
}

export default UserSettingsPage
