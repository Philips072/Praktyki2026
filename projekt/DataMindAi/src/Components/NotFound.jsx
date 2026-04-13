import './NotFound.css'
import { Link } from 'react-router-dom'
import logo from '../assets/nazwa.PNG'

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <img src={logo} alt="DataMindAI" className="notfound-logo" />

        <div className="notfound-code">404</div>

        <h1>Nie znaleziono strony</h1>
        <p>Strona, której szukasz, nie istnieje lub została przeniesiona.</p>

        <Link to="/" className="notfound-btn">Wróć na stronę główną</Link>
      </div>
    </div>
  )
}

export default NotFound