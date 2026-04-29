import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from './supabaseClient'
import { databaseExists, resetDatabase } from './sqliteManager'
import { initializeDatabase } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const currentUserIdRef = useRef(null)

  const fetchProfile = async (userId) => {
    // Jeśli pobieramy profil dla innego użytkownika, anuluj to zapytanie
    if (currentUserIdRef.current && currentUserIdRef.current !== userId) {
      console.log('Anulowanie fetchProfile - userId zmienił się:', currentUserIdRef.current, '->', userId)
      return
    }
    currentUserIdRef.current = userId
    const { data, error } = await supabase
      .from('profiles')
      .select('name, role, sql_level, interests, email')
      .eq('id', userId)
      .single()

    if (error || !data) {
      // Profil nie istnieje - utwórz domyślny
      console.log('Profil nie istnieje, tworzę domyślny dla:', userId)
      const { data: newUser, error: authError } = await supabase.auth.getUser()

      // Sprawdź czy nadal chcemy ten profil
      if (currentUserIdRef.current !== userId) return
      if (!authError && newUser?.user) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: newUser.user.user_metadata?.name || newUser.user.email?.split('@')[0] || 'Użytkownik',
            email: newUser.user.email,
            role: 'uczen'
          })

        if (currentUserIdRef.current !== userId) return

        if (!insertError) {
          // Pobierz nowo utworzony profil
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('name, role, sql_level, interests, email')
            .eq('id', userId)
            .single()

          if (currentUserIdRef.current !== userId) return
          setProfile(newProfile)
        } else {
          console.error('Błąd tworzenia profilu:', insertError)
          setProfile(null)
        }
      } else {
        console.error('Błąd pobierania użytkownika:', authError)
        setProfile(null)
      }
    } else {
      // Sprawdź czy email w profilu jest zgodny z sesją
      const currentUser = await supabase.auth.getUser()
      const sessionEmail = currentUser.data.user?.email

      if (currentUserIdRef.current !== userId) return

      if (sessionEmail && data.email !== sessionEmail) {
        console.log('Email w profilie różni się od sesji - aktualizacja:', data.email, '->', sessionEmail)
        await supabase
          .from('profiles')
          .update({ email: sessionEmail })
          .eq('id', userId)
        data.email = sessionEmail

        if (currentUserIdRef.current !== userId) return
      }

      setProfile(data)
    }
    setLoading(false)
  }

  const createProfileAfterVerification = async (sessionUser) => {
    try {
      console.log('=== createProfileAfterVerification ===')
      console.log('User ID:', sessionUser.id)
      console.log('User email:', sessionUser.email)
      console.log('User metadata:', sessionUser.user_metadata)

      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', sessionUser.id)
        .single()

      console.log('Existing profile check:', { existingProfile, checkError })

      if (!existingProfile) {
        let userName = sessionUser.user_metadata?.name

        if (!userName) {
          const pendingData = localStorage.getItem('pendingRegistration')
          if (pendingData) {
            const { name } = JSON.parse(pendingData)
            userName = name
          }
        }

        const finalName = userName || sessionUser.email?.split('@')[0] || 'Użytkownik'
        console.log('Tworzenie nowego profilu z imieniem:', finalName)

        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: sessionUser.id,
            name: finalName,
            email: sessionUser.email,
            role: 'uczen'
          })
          .select()
          .single()

        console.log('Insert result:', { insertData, insertError })

        if (!insertError) {
          localStorage.removeItem('pendingRegistration')
        }
      } else {
        console.log('Profil już istnieje, pomijam')
        localStorage.removeItem('pendingRegistration')
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia profilu po weryfikacji:', error)
    }
  }

  useEffect(() => {
    let isInitialProfileFetched = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser))
        isInitialProfileFetched = true
        fetchProfile(currentUser.id)
      } else {
        localStorage.removeItem('user')
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      console.log('=== Auth state change ===', { event: _event, userId: currentUser?.id, email: currentUser?.email })
      setUser(currentUser)

      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser))

        if (_event === 'SIGNED_IN') {
          if (currentUser.user_metadata?.name) {
            await createProfileAfterVerification(currentUser)
          }
          // Pobierz profil po potencjalnym utworzeniu
          fetchProfile(currentUser.id)
        } else if (_event === 'INITIAL_SESSION' && !isInitialProfileFetched) {
          // Pobierz profil tylko jeśli nie został jeszcze pobrany
          fetchProfile(currentUser.id)
        } else if (_event === 'TOKEN_REFRESHED') {
          // Pobierz świeży profil po odświeżeniu tokenu
          fetchProfile(currentUser.id)
        }
        // USER_UPDATED jest pomijany aby uniknąć konfliktów z updateUser
      } else {
        localStorage.removeItem('user')
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const refreshProfile = (userId) => fetchProfile(userId ?? user?.id)

  const getUserDatabase = async (lessonId) => {
    if (!user) return null

    console.log('getUserDatabase called with:', { userId: user.id, lessonId })

    const exists = await databaseExists(lessonId)

    console.log('Database exists:', exists)

    if (!exists) {
      await resetDatabase(user.id, lessonId)
    }

    return { lessonId }
  }

  const resetUserDatabase = async (lessonId) => {
    if (!user) return null
    await resetDatabase(user.id, lessonId)
    return { lessonId }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, getUserDatabase, resetUserDatabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
