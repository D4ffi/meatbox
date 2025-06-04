// src/hooks/useTokenManager.ts - Versión completamente corregida
import { useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { supabaseClient } from '../utils/supabase'

export const useTokenManager = () => {
    const { session, isTokenExpiringSoon } = useAuth()

    // Función para refrescar token automáticamente
    const autoRefreshToken = useCallback(async (): Promise<void> => {
        if (!session || !isTokenExpiringSoon(90)) return // 90 minutos = 1.5 horas antes

        try {
            const { data, error } = await supabaseClient.auth.refreshSession()

            if (error) {
                console.error('Error auto-refreshing token:', error)
                return
            }

            if (data.session && data.session.expires_at) {
                console.log('Token auto-refreshed successfully')

                // Usar data para obtener información del nuevo token
                const expiresAt = new Date(data.session.expires_at * 1000)

                console.log('Nuevo token expira en:', expiresAt)

                // Verificar si electronAPI está disponible antes de usarlo
                if (typeof window !== 'undefined' && window.electronAPI) {
                    window.electronAPI.send('token-refreshed', {
                        userId: data.session.user.id,
                        expiresAt: expiresAt.toISOString()
                    })
                }
            }
        } catch (error) {
            console.error('Unexpected error during auto-refresh:', error)
        }
    }, [session, isTokenExpiringSoon])

    // Configurar refresh automático
    useEffect(() => {
        if (!session) return

        // Verificar cada 30 minutos si necesita refresh
        const interval = setInterval(() => {
            void autoRefreshToken()
        }, 30 * 60 * 1000)

        return () => clearInterval(interval)
    }, [session, autoRefreshToken])

    // Función para obtener headers de autenticación
    const getAuthHeaders = useCallback((): Record<string, string> => {
        if (!session?.access_token) return {}

        return {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
        }
    }, [session])

    // Función para hacer peticiones autenticadas
    const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
        const headers = getAuthHeaders()

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                ...options.headers
            }
        })

        // Si el token expiró, intentar refresh automático
        if (response.status === 401) {
            await autoRefreshToken()

            // Reintentar con el nuevo token (después del refresh, obtener headers actualizados)
            const newHeaders = getAuthHeaders()
            return fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...newHeaders,
                    ...options.headers
                }
            })
        }

        return response
    }, [getAuthHeaders, autoRefreshToken])

    return {
        autoRefreshToken,
        getAuthHeaders,
        authenticatedFetch,
        tokenExpiresAt: (session?.expires_at && typeof session.expires_at === 'number')
            ? new Date(session.expires_at * 1000)
            : null
    }
}