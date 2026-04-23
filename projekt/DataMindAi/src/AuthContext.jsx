import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { createLessonDatabase, saveDatabaseToLocalStorage, loadDatabaseFromLocalStorage, loadDatabaseFromBuffer } from './sqliteManager'

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
      // Fallback — kolumny sql_level/interests mogą jeszcze nie istnieć w bazie
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const refreshProfile = (userId) => fetchProfile(userId ?? user?.id)

  const getUserDatabase = async (lessonId) => {
    if (!user) return null
    let buffer = loadDatabaseFromLocalStorage(user.id, lessonId)

    if (!buffer) {
      buffer = await createLessonDatabase(lessonId)
      saveDatabaseToLocalStorage(user.id, lessonId, buffer)
    }

    return loadDatabaseFromBuffer(buffer)
  }

  const resetUserDatabase = async (lessonId) => {
    if (!user) return null
    const buffer = await createLessonDatabase(lessonId)
    saveDatabaseToLocalStorage(user.id, lessonId, buffer)
    return loadDatabaseFromBuffer(buffer)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, getUserDatabase, resetUserDatabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
