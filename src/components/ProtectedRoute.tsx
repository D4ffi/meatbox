// src/components/ProtectedRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
    redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  redirectTo = '/login'
                                                              }) => {
    const { isAuthenticated, loading, initialized } = useAuthContext()

    // Mostrar loading mientras se inicializa
    if (!initialized || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />
    }

    return <>{children}</>
}