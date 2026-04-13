import './RegisterPage.css'
import { Link } from 'react-router-dom'
import Register from '../Components/Register'
import HomeHeader from '../Components/HomeHeader'

function RegisterPage() {
  
  return (
    <div className="register-page">
        <HomeHeader/>
        <Register/>
    </div>
  )
}

export default RegisterPage