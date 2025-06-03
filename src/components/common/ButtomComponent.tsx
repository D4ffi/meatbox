import React from "react";

interface ButtonComponentProps {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
    loading?: boolean;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
                                                                    text,
                                                                    onClick,
                                                                    type = "button",
                                                                    disabled = false,
                                                                    variant = "primary",
                                                                    className = "",
                                                                    loading = false,
                                                                }) => {
    const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-blue-300 disabled:text-blue-300"
    };

    const disabledClasses = disabled || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cargando...
                </div>
            ) : (
                text
            )}
        </button>
    );
};