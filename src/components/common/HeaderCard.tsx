
import {LucideIcon} from "lucide-react";
import React from "react";

interface HeaderCardProps {
    title: string;
    description: string;
    className?: string;
    icon?: LucideIcon;

}

export const HeaderCard: React.FC<HeaderCardProps> = ({
    title,
    description,
    className = "",
    icon: Icon
}) => {
    return (
        <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
            <div className="flex items-center space-x-4">
                {Icon && <Icon className="h-6 w-6 text-blue-600" />}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
};
