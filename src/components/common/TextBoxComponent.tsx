import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextBoxComponentProps {
    hint?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isPassword?: boolean;
    type?: 'text' | 'email' | 'number' | 'tel' | 'url';
    disabled?: boolean;
    error?: string;
    className?: string;
}

export const TextBoxComponent: React.FC<TextBoxComponentProps> = ({
                                                                      hint,
                                                                      value,
                                                                      onChange,
                                                                      placeholder,
                                                                      isPassword = false,
                                                                      type = 'text',
                                                                      disabled = false,
                                                                      error,
                                                                      className = '',
                                                                  }) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`w-full ${className}`}>
            {hint && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {hint}
                </label>
            )}

            <div className="relative">
                <input
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }
            ${disabled
                        ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-gray-900'
                    }
            ${isPassword ? 'pr-10' : ''}
          `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        disabled={disabled}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};