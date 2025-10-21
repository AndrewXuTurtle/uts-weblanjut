"use client";

type ButtonProps = {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "outline" | "ghost" | "link";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    className?: string;
};

export function Button({
    label, 
    onClick, 
    variant = "primary",
    size = "md",
    disabled = false,
    className = ""
}: ButtonProps) {
    const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400",
        success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-400",
        outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400",
        link: "bg-transparent text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500"
    };
    
    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-lg"
    };
    
    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];
    
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
        >
            {label}
        </button>
    );
}
    
    