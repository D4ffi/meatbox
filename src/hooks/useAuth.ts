import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabaseClient } from '../utils/supabase.ts'

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Obtener sesión actual
        const getSession = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getSession()

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [session?.user])

    const signOut = async () => {
        const { error } = await supabaseClient.auth.signOut()
        if (error) {
            console.error('Error signing out:', error)
        }
    }

    return {
        user,
        session,
        loading,
        signOut,
        isAuthenticated: !!user
    }
}