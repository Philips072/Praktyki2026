import './LecturesPage.css'
import { Link } from 'react-router-dom'
import Lectures from '../Components/Lectures'

function LecturesPage() {
  
  return (
    <div className="lectures-page">
        <Lectures/>
    </div>
  )
}

export default LecturesPage