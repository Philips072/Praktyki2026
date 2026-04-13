import './DashboardPage.css'
import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'
import Dashboard1 from '../Components/Dashboard1'
import Dashboard2 from '../Components/Dashboard2'

function DashboardPage(){
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return(
        <div style={{ position: 'relative' }}>
           {sidebarOpen && (
    <button 
        onClick={() => setSidebarOpen(false)}
        style={{
            position: 'fixed',
            top: '23px',
            left: '155px',
            zIndex: 200,
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: window.innerWidth <= 640 ? 'block' : 'none'
        }}
    >
        ✕
    </button>
)}
            <SidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <Dashboard1 />
                <Dashboard2 />
            </SidebarHeader>
        </div>
    )
}

export default DashboardPage