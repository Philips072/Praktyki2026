import './DashboardPage.css'
import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import Dashboard1 from '../Components/Dashboard1'
import Dashboard2 from '../Components/Dashboard2'

function DashboardPage(){
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return(
        <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Dashboard1 />
            <Dashboard2 />
        </SidebarHeader>
    )
}

export default DashboardPage