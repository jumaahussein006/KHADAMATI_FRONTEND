import React from 'react';
import { motion } from 'framer-motion';

/**
 * Badge Component for status indicators and labels
 * Supports different variants and sizes
 * 
 * @param {String} variant - 'pending', 'inProgress', 'completed', 'cancelled', 'success', 'warning', 'error', 'info', 'default'
 * @param {String} size - 'sm', 'md', 'lg'
 * @param {String} children - Badge content
 * @param {React.Element} icon - Optional icon element
 * @param {Boolean} animate - Enable entrance animation
 */
const Badge = ({
    variant = 'default',
    size = 'md',
    children,
    icon,
    animate = false,
    className = ''
}) => {
    const variants = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        inProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        error: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    const badgeClasses = `
    inline-flex items-center gap-1.5
    ${sizes[size]}
    ${variants[variant]}
    border
    rounded-full
    font-semibold
    whitespace-nowrap
    ${className}
  `;

    const BadgeContent = () => (
        <span className={badgeClasses}>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </span>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-block"
            >
                <BadgeContent />
            </motion.div>
        );
    }

    return <BadgeContent />;
};

export default Badge;
