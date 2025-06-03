import { HeaderCard } from "../../components/common/HeaderCard.tsx";
import { Package, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const ProductPage = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header con botón de logout */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Package className="h-8 w-8 text-blue-600 mr-2" />
                            <h1 className="text-xl font-semibold text-gray-900">
                                Mi Aplicación
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-1" />
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <HeaderCard
                    title="Productos"
                    description="Aquí puedes ver todos los productos disponibles."
                    className="mb-4"
                    icon={Package}
                />

                {/* Aquí puedes agregar el contenido de tus productos */}
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">
                        ¡Bienvenido! Aquí irán tus productos.
                    </p>
                </div>
            </main>
        </div>
    );
};