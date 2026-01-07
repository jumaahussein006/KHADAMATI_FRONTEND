/**
 * Backend Connection Test Page
 * Simple UI to test backend connectivity
 */

import React, { useState } from 'react';
import { healthAPI, categoriesAPI } from '../services/apiService';

const BackendTest = () => {
    const [healthStatus, setHealthStatus] = useState(null);
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await healthAPI.check();
            setHealthStatus(response);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const testCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    🔗 Backend Connection Test
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Server Status
                    </h2>

                    <button
                        onClick={testHealth}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Testing...' : 'Test Health Check'}
                    </button>

                    {healthStatus && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-green-800 dark:text-green-200 font-mono text-sm">
                                ✅ Backend is running!
                            </p>
                            <pre className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                                {JSON.stringify(healthStatus, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Categories API
                    </h2>

                    <button
                        onClick={testCategories}
                        disabled={loading}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Fetch Categories'}
                    </button>

                    {categories && (
                        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-purple-800 dark:text-purple-200 font-mono text-sm mb-2">
                                ✅ Found {categories.data?.length || 0} categories
                            </p>
                            <pre className="mt-2 text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-96">
                                {JSON.stringify(categories, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200 font-bold">
                            ❌ Error: {error}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            Make sure the backend server is running on http://localhost:5000
                        </p>
                    </div>
                )}

                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mt-8">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        📋 Quick Guide
                    </h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>✅ Backend URL: http://localhost:5000/api/v1</li>
                        <li>✅ Frontend URL: http://localhost:3000</li>
                        <li>✅ Click buttons above to test connectivity</li>
                        <li>✅ Check console for detailed logs</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BackendTest;
