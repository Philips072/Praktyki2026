import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from './supabaseClient'
import { databaseExists, resetDatabase } from './sqliteManager'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchProfileRef = useRef(null)

  const fetchProfile = async (userId) => {
    // Anuluj poprzednie zapytanie jeśli to dla innego użytkownika
    if (fetchProfileRef.current && fetchProfileRef.current !== userId) {
      console.log('Anulowanie poprzedniego fetchProfile dla:', userId)
    }

    fetchProfileRef.current = userId

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, role, sql_level, interests, email')
        .eq('id', userId)
        .single()

      // Sprawdź czy to jest nadal odpowiednie zapytanie
      if (fetchProfileRef.current !== userId) return

      if (error || !data) {
        // Profil nie istnieje - utwórz domyślny
        console.log('=== Profil nie istnieje, tworzę domyślny dla:', userId, 'error:', error)

        // Pobierz z sesji dane użytkownika
        const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser()

        console.log('=== Session user:', sessionUser, 'sessionError:', sessionError)

        if (fetchProfileRef.current !== userId) return

        if (sessionUser) {
          console.log('=== Próba wstawienia profilu dla userId:', userId, 'z nazwą:', sessionUser.user_metadata?.name)

          const { data: insertedData, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'Użytkownik',
              email: sessionUser.email,
              role: 'uczen'
            })
            .select()
            .single()

          console.log('=== Insert result:', { insertedData, insertError })

          if (fetchProfileRef.current !== userId) return

          if (insertError) {
            console.error('=== Błąd tworzenia profilu:', insertError)
            setProfile(null)
          } else {
            // Użyj zwróconych danych z insert
            console.log('=== Profil utworzony:', insertedData)
            setProfile(insertedData)
          }
        } else {
          console.error('=== Brak sesji użytkownika, sessionError:', sessionError)
          setProfile(null)
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Błąd fetchProfile:', err)
      if (fetchProfileRef.current === userId) {
        setProfile(null)
      }
    } finally {
      if (fetchProfileRef.current === userId) {
        setLoading(false)
      }
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      console.log('=== Auth state change ===', { event: _event, userId: currentUser?.id, email: currentUser?.email })
      setUser(currentUser)

      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser))

        if (_event === 'SIGNED_IN') {
          // Pobierz profil po zalogowaniu - fetchProfile automatycznie utworzy profil jeśli nie istnieje
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

    return () => {
      subscription.unsubscribe()
      fetchProfileRef.current = null
    }
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
