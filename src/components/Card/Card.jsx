import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Card Component with animations
 * Perfect for dashboard widgets, content blocks, etc.
 * 
 * @param {String} title - Card title
 * @param {String} subtitle - Card subtitle
 * @param {React.Element} icon - Optional icon element
 * @param {React.Element} action - Optional action element (button, link, etc.)
 * @param {String} variant - 'default', 'gradient', 'outlined'
 * @param {Boolean} hoverable - Enable hover animations
 * @param {Boolean} animate - Enable entrance animation
 */
const Card = ({
    title,
    subtitle,
    icon,
    action,
    children,
    variant = 'default',
    hoverable = true,
    animate = true,
    className = ''
}) => {
    const variants = {
        default: 'bg-white dark:bg-gray-800 shadow-lg',
        gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl',
        outlined: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
    };

    const cardClasses = `
    ${variants[variant]}
    rounded-2xl
    overflow-hidden
    transition-all duration-300
    ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1' : ''}
    ${className}
  `;

    const cardContent = (
        <div className={cardClasses}>
            {/* Card Header */}
            {(title || icon || action) && (
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="flex-shrink-0 p-2 bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] rounded-xl">
                                    <div className="text-white">{icon}</div>
                                </div>
                            )}
                            <div>
                                {title && (
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {title}
                                    </h3>
                                )}
                                {subtitle && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        {action && <div className="flex-shrink-0">{action}</div>}
                    </div>
                </div>
            )}

            {/* Card Body */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                {cardContent}
            </motion.div>
        );
    }

    return cardContent;
};

/**
 * Stat Card Component for dashboard statistics
 */
export const StatCard = ({
    title,
    value,
    change,
    icon,
    trend = 'neutral',
    animate = true,
    className = ''
}) => {
    const trendColors = {
        up: 'text-green-600 dark:text-green-400',
        down: 'text-red-600 dark:text-red-400',
        neutral: 'text-gray-600 dark:text-gray-400'
    };

    const cardContent = (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {title}
                </h3>
                {icon && (
                    <div className="p-3 bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] rounded-xl">
                        <div className="text-white text-xl">{icon}</div>
                    </div>
                )}
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                    {change && (
                        <p className={`text-sm mt-2 ${trendColors[trend]}`}>
                            {change}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                {cardContent}
            </motion.div>
        );
    }

    return cardContent;
};

export default Card;
