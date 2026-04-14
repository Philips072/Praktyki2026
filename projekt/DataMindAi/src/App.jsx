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
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import OnboardingPage from './Pages/OnboardingPage'
import LessonPage from './Pages/LessonPage'
import MessagesPage from './Pages/MessagesPage'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logowanie" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/rejestracja" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/reset-hasla" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lekcje" element={<LecturesPage />} />
        <Route path="/lekcja/:id" element={<LessonPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/wiadomosci" element={<MessagesPage />} />
        <Route path="/ustawienia" element={<UserSettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
