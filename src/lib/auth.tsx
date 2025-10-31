import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

type User = any

type AuthContextValue = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, data?: Record<string, any>) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getUser() {
      try {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(data?.user ?? null)
      } catch (e) {
        // ignore
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, data?: Record<string, any>) => {
    const res = await supabase.auth.signUp({ email, password }, { data })
    return res
  }

  const signIn = async (email: string, password: string) => {
    const res = await supabase.auth.signInWithPassword({ email, password })
    return res
  }

  const signOut = async () => {
    const res = await supabase.auth.signOut()
    setUser(null)
    return res
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthProvider
