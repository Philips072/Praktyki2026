import './OnboardingPage.css'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import OnboardingContent from '../Components/OnboardingModal'

function OnboardingPage() {
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()

  const handleComplete = async ({ sql_level, interests }) => {
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ sql_level, interests })
        .eq('id', user.id)
      await refreshProfile(user.id)
    }
    navigate('/dashboard')
  }

  return (
    <div className="onboarding-page">
      <OnboardingContent onComplete={handleComplete} />
    </div>
  )
}

export default OnboardingPage
