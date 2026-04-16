import './DashboardPage.css'
import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import Dashboard1 from '../Components/Dashboard1'
import Dashboard2 from '../Components/Dashboard2'
import AssignedTests from '../Components/AssignedTests'
import { useAuth } from '../AuthContext'

function DashboardPage(){
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 640)
    const { profile } = useAuth()

    return(
        <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Dashboard1 />
            <Dashboard2 />
            {/* Testy przypisane przez nauczyciela — widoczne tylko dla ucznia */}
            {profile?.role === 'uczen' && <AssignedTests />}
        </SidebarHeader>
    )
}

export default DashboardPage