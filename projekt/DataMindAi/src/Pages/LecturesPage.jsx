import './LecturesPage.css'
import { Link } from 'react-router-dom'
import Lectures from '../Components/Lectures'
import { useState } from 'react'
import SidebarHeader from '../Components/SidebarHeader'

function LecturesPage() {
  
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
                <Lectures />
            </SidebarHeader>
        </div>
    )
}

export default LecturesPage