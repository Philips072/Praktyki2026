import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import PublicRoute from './Components/PublicRoute'
import PrivateRoute from './Components/PrivateRoute'
import AdminRoute from './Components/AdminRoute'
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
import TeacherPanelPage from './Pages/TeacherPanelPage'
import AdminPanelPage from './Pages/AdminPanelPage'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        {/* Publiczne */}
        <Route path="/" element={<HomePage />} />
        <Route path="/logowanie" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/rejestracja" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/reset-hasla" element={<ForgotPasswordPage />} />

        {/* Wymaga zalogowania */}
        <Route path="/onboarding"   element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
        <Route path="/dashboard"    element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/lekcje"       element={<PrivateRoute><LecturesPage /></PrivateRoute>} />
        <Route path="/lekcja/:id"   element={<PrivateRoute><LessonPage /></PrivateRoute>} />
        <Route path="/ai-chat"      element={<PrivateRoute><AIChatPage /></PrivateRoute>} />
        <Route path="/wiadomosci"   element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
        <Route path="/ustawienia"          element={<PrivateRoute><UserSettingsPage /></PrivateRoute>} />
        <Route path="/panel-nauczyciela"   element={<PrivateRoute><TeacherPanelPage /></PrivateRoute>} />
        <Route path="/panel-admina"        element={<AdminRoute><AdminPanelPage /></AdminRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
