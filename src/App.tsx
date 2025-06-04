// src/App.tsx - Versión actualizada
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginComponent } from './pages/LogIn/LogInPage.tsx'
import { ProductPage } from './pages/Product/ProductPage'
import { AccountPage } from "./pages/Account/AccountPage.tsx"
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function AppRoutes() {
    const { isAuthenticated, loading, initialized } = useAuthContext()

    // Loading inicial mientras se inicializa la autenticación
    if (!initialized || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Inicializando aplicación...</p>
                </div>
            </div>
        )
    }

    return (
        <Routes>
            {/* Ruta de login - si ya está autenticado, redirige a productos */}
            <Route
                path="/login"
                element={
                    isAuthenticated ?
                        <Navigate to="/productos" replace /> :
                        <LoginComponent />
                }
            />

            {/* Rutas protegidas */}
            <Route
                path="/productos"
                element={
                    <ProtectedRoute>
                        <ProductPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/cuentas"
                element={
                    <ProtectedRoute>
                        <AccountPage />
                    </ProtectedRoute>
                }
            />

            {/* Ruta raíz - redirige según el estado de autenticación */}
            <Route
                path="/"
                element={
                    <Navigate
                        to={isAuthenticated ? "/productos" : "/login"}
                        replace
                    />
                }
            />

            {/* Ruta 404 - cualquier ruta no encontrada */}
            <Route
                path="*"
                element={
                    <Navigate
                        to={isAuthenticated ? "/productos" : "/login"}
                        replace
                    />
                }
            />
        </Routes>
    )
}

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <AppRoutes />
            </div>
        </AuthProvider>
    )
}

export default App