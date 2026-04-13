import './LoginPage.css'
import { Link } from 'react-router-dom'
import Login from '../Components/Login'
import HomeHeader from '../Components/HomeHeader'

function LoginPage() {
  
  return (
    <div className="login-page">
        <HomeHeader/>
        <Login/>
    </div>
  )
}

export default LoginPage