import React, { useState } from "react";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../utils/supabase.ts";
import { TextBoxComponent } from "../../components/common/TextBoxComponent.tsx";
import { ButtonComponent } from "../../components/common/ButtomComponent.tsx";

export const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Por favor ingresa email y contraseña");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                setError(error.message);
            } else if (data.user) {
                // Login exitoso, redirigir a productos
                navigate("/productos");
            }
        } catch (error) {
            setError("Error al iniciar sesión. Inténtalo de nuevo.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Por favor ingresa tu email para recuperar la contraseña");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

            if (error) {
                setError(error.message);
            } else {
                setError("Se ha enviado un email para restablecer tu contraseña");
            }
        } catch (error) {
            setError("Error al enviar email de recuperación");
            console.error("Reset password error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <Package size={64} className="text-blue-600" />
                    </div>

                    {/* Espacio con padding 6 */}
                    <div className="pt-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Iniciar Sesión
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <TextBoxComponent
                            hint="Email"
                            value={email}
                            onChange={setEmail}
                            placeholder="Ingresa tu email"
                            type="email"
                        />

                        {/* Contraseña */}
                        <TextBoxComponent
                            hint="Contraseña"
                            isPassword={true}
                            value={password}
                            onChange={setPassword}
                            placeholder="Ingresa tu contraseña"
                        />

                        {/* Olvidaste tu contraseña */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={loading}
                                className="text-sm text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:underline disabled:opacity-50"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    </div>

                    {/* Botón de Login */}
                    <div className="pt-4">
                        <ButtonComponent
                            text={loading ? "Entrando..." : "Entrar"}
                            onClick={handleLogin}
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};