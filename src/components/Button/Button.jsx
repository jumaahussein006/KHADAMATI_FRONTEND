import React from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Button Component
 * Supports different variants, sizes, and states
 * 
 * @param {String} variant - 'primary', 'secondary', 'outline', 'ghost', 'danger'
 * @param {String} size - 'sm', 'md', 'lg'
 * @param {Boolean} loading - Show loading state
 * @param {Boolean} disabled - Disabled state
 * @param {Boolean} fullWidth - Full width button
 * @param {React.Element} leftIcon - Icon on the left
 * @param {React.Element} rightIcon - Icon on the right
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-300
  ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-[#0BA5EC] to-[#0891D1]
      text-white
      hover:shadow-lg hover:shadow-[#0BA5EC]/30
      hover:scale-105
      active:scale-95
      focus:ring-[#0BA5EC]
    `,
        secondary: `
      bg-gray-200 dark:bg-gray-700
      text-gray-900 dark:text-white
      hover:bg-gray-300 dark:hover:bg-gray-600
      hover:scale-105
      active:scale-95
      focus:ring-gray-400
    `,
        outline: `
      bg-transparent
      border-2 border-[#0BA5EC]
      text-[#0BA5EC]
      hover:bg-[#0BA5EC] hover:text-white
      hover:shadow-lg hover:shadow-[#0BA5EC]/20
      hover:scale-105
      active:scale-95
      focus:ring-[#0BA5EC]
    `,
        ghost: `
      bg-transparent
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800
      hover:scale-105
      active:scale-95
      focus:ring-gray-400
    `,
        danger: `
      bg-gradient-to-r from-red-500 to-red-600
      text-white
      hover:shadow-lg hover:shadow-red-500/30
      hover:scale-105
      active:scale-95
      focus:ring-red-500
    `
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

    const LoadingSpinner = () => (
        <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    return (
        <motion.button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            {...props}
        >
            {loading ? (
                <>
                    <LoadingSpinner />
                    {children}
                </>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </motion.button>
    );
};

export default Button;
