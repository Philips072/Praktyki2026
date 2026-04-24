import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { databaseExists, resetDatabase } from './sqliteManager'

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser))
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
