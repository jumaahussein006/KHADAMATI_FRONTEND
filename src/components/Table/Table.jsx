import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * Reusable Table Component with RTL/LTR support and dark mode
 * Ensures perfect alignment between headers and cells
 * 
 * @param {Array} columns - Array of column definitions: [{ key, label, align, render }]
 * @param {Array} data - Array of data objects
 * @param {String} emptyMessage - Message when no data
 * @param {Boolean} hoverable - Enable row hover effect
 * @param {Boolean} striped - Enable striped rows
 */
const Table = ({
    columns = [],
    data = [],
    emptyMessage,
    hoverable = true,
    striped = false,
    className = ''
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const getAlignment = (columnAlign) => {
        if (columnAlign) return columnAlign;
        return isRTL ? 'text-right' : 'text-left';
    };

    const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Table Header */}
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-600">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || index}
                                    className={`
                    ${getAlignment(column.align)}
                    px-4 py-4
                    text-sm font-bold
                    text-gray-700 dark:text-gray-200
                    uppercase tracking-wider
                    whitespace-nowrap
                  `}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <motion.tbody
                        variants={tableVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <motion.tr
                                    key={row.id || rowIndex}
                                    variants={rowVariants}
                                    className={`
                    border-b border-gray-200 dark:border-gray-700
                    ${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200' : ''}
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}
                  `}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={column.key || colIndex}
                                            className={`
                        ${getAlignment(column.align)}
                        px-4 py-4
                        text-sm
                        text-gray-900 dark:text-gray-100
                        whitespace-nowrap
                      `}
                                        >
                                            {column.render ? column.render(row, rowIndex) : row[column.key]}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-16 text-center text-gray-500 dark:text-gray-400"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <svg
                                            className="w-16 h-16 text-gray-300 dark:text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            />
                                        </svg>
                                        <p className="text-lg font-medium">
                                            {emptyMessage || t('common.noData')}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
