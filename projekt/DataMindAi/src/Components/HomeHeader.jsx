import './HomeHeader.css'
import { Link } from 'react-router-dom'

function HomeHeader() {
  return (
    <>
        <header>
            <ul>
                <li><Link to="/"><img src="src/assets/nazwa.PNG" alt="DataMindAI" /></Link></li>
                <li>
                    <Link to="/"><button>Zaloguj się</button></Link>
                    <Link to="/"><button>Rozpocznij za darmo</button></Link>
                </li>
                <li className="hamburger">
                    <div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </li>
            </ul>
        </header>
    </>
  )
}

export default HomeHeader