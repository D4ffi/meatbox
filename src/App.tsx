import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginComponent } from './pages/LogIn/LogInPage.tsx'
import { ProductPage } from './pages/Product/ProductPage'
import { useEffect, useState } from 'react'
import { supabaseClient } from './utils/supabase'
import { User } from '@supabase/supabase-js'
import {AccountPage} from "./pages/Account/AccountPage.tsx";

function App() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar si hay un usuario autenticado al cargar la app
        const getSession = async () => {
            try {
                const { data: { session } } = await supabaseClient.auth.getSession()
                setUser(session?.user ?? null)
            } catch (error) {
                console.error('Error getting session:', error)
            } finally {
                setLoading(false)
            }
        }

        getSession()

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            async (event , session) => {
                console.log('Auth state changed:', event, session?.user?.email)
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="App">
            <Routes>
                {/* Ruta de login - si ya está autenticado, redirige a productos */}
                <Route
                    path="/login"
                    element={user ? <Navigate to="/productos" replace /> : <LoginComponent />}
                />

                {/* Ruta de productos - solo accesible si está autenticado */}
                <Route
                    path="/productos"
                    element={user ? <ProductPage /> : <Navigate to="/login" replace />}
                />

                {/* Ruta raíz - redirige según el estado de autenticación */}
                <Route
                    path="/"
                    element={<Navigate to={user ? "/productos" : "/login"} replace />}
                />

                {/* Ruta 404 - cualquier ruta no encontrada */}
                <Route
                    path="*"
                    element={<Navigate to={user ? "/productos" : "/login"} replace />}
                />

                <Route
                    path="/cuentas"
                    element={user ? <AccountPage/> : <Navigate to="/login" replace />}
                />

            </Routes>
        </div>
    )
}

export default App