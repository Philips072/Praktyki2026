import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import PublicRoute from './Components/PublicRoute'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import DashboardPage from './Pages/DashboardPage'
import LecturesPage from './Pages/LecturesPage'
import UserSettingsPage from './Pages/UserSettingsPage'
import NotFoundPage from './Pages/NotFoundPage'
import AIChatPage from './Pages/AIChatPage'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logowanie" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/rejestracja" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lekcje" element={<LecturesPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/osiagniecia" element={<UserSettingsPage />} />
        <Route path="/ustawienia" element={<UserSettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
