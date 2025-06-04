// src/hooks/useAuth.ts - Versión corregida y mejorada
import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabaseClient } from '../utils/supabase.ts'

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        let mounted = true

        const initializeAuth = async (): Promise<void> => {
            try {
                // Obtener sesión actual
                const { data: { session }, error } = await supabaseClient.auth.getSession()

                if (error) {
                    console.error('Error getting session:', error)
                    // En Electron, podríamos limpiar datos corruptos
                    await supabaseClient.auth.signOut()
                }

                if (mounted) {
                    setSession(session)
                    setUser(session?.user ?? null)
                    setLoading(false)
                    setInitialized(true)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                if (mounted) {
                    setLoading(false)
                    setInitialized(true)
                }
            }
        }

        void initializeAuth()

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email)

                if (mounted) {
                    setSession(session)
                    setUser(session?.user ?? null)
                    setLoading(false)

                    // En Electron, podemos manejar eventos específicos
                    if (event === 'SIGNED_OUT') {
                        // Limpiar cualquier dato local si es necesario
                        localStorage.clear()
                    }

                    if (event === 'TOKEN_REFRESHED') {
                        console.log('Token refreshed successfully')
                    }
                }
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async (): Promise<void> => {
        try {
            const { error } = await supabaseClient.auth.signOut()
            if (error) {
                console.error('Error signing out:', error)
            }

            // En Electron, podríamos cerrar ventanas adicionales o limpiar caché
            localStorage.clear()

        } catch (error) {
            console.error('Unexpected error during sign out:', error)
        }
    }

    const refreshSession = async (): Promise<{ success: boolean; session: Session | null }> => {
        try {
            const { data, error } = await supabaseClient.auth.refreshSession()

            if (error) {
                console.error('Error refreshing session:', error)
                return { success: false, session: null }
            }

            // Aquí SÍ usamos data para obtener la nueva sesión
            const newSession = data.session

            if (newSession) {
                setSession(newSession)
                setUser(newSession.user)
                return { success: true, session: newSession }
            }

            return { success: false, session: null }

        } catch (error) {
            console.error('Unexpected error refreshing session:', error)
            return { success: false, session: null }
        }
    }

    // Función adicional para obtener el token actual
    const getAccessToken = (): string | null => {
        return session?.access_token ?? null
    }

    // Función para verificar si el token está cerca de expirar
    const isTokenExpiringSoon = (minutesThreshold = 5): boolean => {
        if (!session?.expires_at || typeof session.expires_at !== 'number') {
            return false
        }

        const expirationTime = session.expires_at * 1000 // Convertir a millisegundos
        const now = Date.now()
        const threshold = minutesThreshold * 60 * 1000 // Convertir minutos a millisegundos

        return (expirationTime - now) <= threshold
    }

    return {
        user,
        session,
        loading,
        initialized,
        signOut,
        refreshSession,
        getAccessToken,
        isTokenExpiringSoon,
        isAuthenticated: !!user && !!session
    }
}