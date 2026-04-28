import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { databaseExists, resetDatabase } from './sqliteManager'
import { initializeDatabase } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, role, sql_level, interests')
      .eq('id', userId)
      .single()

    if (error) {
      const { data: fallback } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', userId)
        .single()
      setProfile(fallback)
    } else {
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

        try {
          await initializeDatabase(sessionUser.id, 1)
          console.log('Baza SQLite utworzona')
        } catch (dbError) {
          console.error('Nie udało się utworzyć bazy SQLite dla lekcji 1:', dbError)
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser))
        fetchProfile(currentUser.id)
      } else {
        localStorage.removeItem('user')
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser))

        if (_event === 'SIGNED_IN' && currentUser.user_metadata?.name) {
          await createProfileAfterVerification(currentUser)
        }

        fetchProfile(currentUser.id)
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
