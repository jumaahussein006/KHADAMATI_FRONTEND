import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Page Transition Wrapper Component
 * Provides smooth page transitions with RTL/LTR support
 * 
 * @param {React.Element} children - Page content
 * @param {String} variant - 'fade', 'slide', 'slideUp', 'scale'
 */
const PageTransition = ({ children, variant = 'fade' }) => {
    const location = useLocation();
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const variants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        slide: {
            initial: { opacity: 0, x: isRTL ? -20 : 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: isRTL ? 20 : -20 }
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants[variant]}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut'
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

/**
 * Stagger Container for animating children with delay
 */
export const StaggerContainer = ({ children, className = '', delay = 0.1 }) => {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: delay
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Fade In Up Animation Component
 */
export const FadeInUp = ({ children, delay = 0, className = '' }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Scale In Animation Component
 */
export const ScaleIn = ({ children, delay = 0, className = '' }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.3, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
