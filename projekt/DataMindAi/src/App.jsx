import { Routes, Route, BrowserRouter } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import DashboardPage from './Pages/DashboardPage'
import LecturesPage from './Pages/LecturesPage'
import UserSettingsPage from './Pages/UserSettingsPage'
import NotFoundPage from './Pages/NotFoundPage'


function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logowanie" element={<LoginPage />} />
        <Route path="/rejestracja" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lekcje" element={<LecturesPage />} />
        <Route path="/ustawienia" element={<UserSettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
