import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { initializeUserData } from './userInit'

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

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      // Inicializar dados apenas no login (não no signup para evitar conflitos)
      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(async () => {
          await initializeUserData(session.user.id)
        }, 1000)
      }
      
      setLoading(false)
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, data?: Record<string, any>) => {
    const res = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data,
        emailRedirectTo: `${window.location.origin}/auth`
      }
    })
    return res
  }

  const signIn = async (email: string, password: string) => {
    const res = await supabase.auth.signInWithPassword({ email, password })
    return res
  }

  const signOut = async () => {
    console.log('Starting logout...')
    
    // Limpar estado local imediatamente
    setUser(null)
    localStorage.removeItem('userPlan')
    localStorage.clear()
    
    try {
      // Tentar logout no Supabase com timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
      
      const logoutPromise = supabase.auth.signOut()
      
      await Promise.race([logoutPromise, timeoutPromise])
      console.log('Supabase logout successful')
    } catch (error) {
      console.log('Supabase logout failed or timeout, but local logout completed:', error)
    }
    
    console.log('Logout completed')
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthProvider
