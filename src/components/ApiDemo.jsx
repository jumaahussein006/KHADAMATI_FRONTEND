import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { servicesAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { getServiceName } from '../utils/langHelper';

const ApiDemo = () => {
    const { t, i18n } = useTranslation();
    const { isProvider, isCustomer, isAuthenticated } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newService, setNewService] = useState({ title: '', description: '', category_id: 1 });

    // 1. GET Request (Fetch Services)
    const fetchServices = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await servicesAPI.getAll();
            setServices(response.data);
        } catch (err) {
            setError('Failed to fetch services');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // 2. POST Request (Create Service - Provider Only)
    const handleCreateService = async (e) => {
        e.preventDefault();
        if (!newService.title || !newService.description) return;

        try {
            await servicesAPI.create(newService);
            // Refresh list after creation
            fetchServices();
            setNewService({ title: '', description: '', category_id: 1 });
            alert('Service Created!');
        } catch (err) {
            alert(err.message || 'Failed to create service');
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto my-10 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Backend API Demo</h2>

            {/* Status Section */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
                <p><strong>Auth Status:</strong> {isAuthenticated ? 'Logged In' : 'Guest'}</p>
                {isAuthenticated && <p><strong>Role:</strong> {isProvider ? 'Provider' : isCustomer ? 'Customer' : 'Admin'}</p>}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* GET Demo: List Services */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">Services List (GET)</h3>
                    <button onClick={fetchServices} className="text-sm text-blue-600 underline">Refresh</button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ul className="space-y-2 border-t pt-2">
                        {services.length === 0 ? <p className="text-gray-500">No services found.</p> : null}
                        {services.map((service) => (
                            <li key={service.service_id} className="p-2 bg-gray-100 rounded flex justify-between">
                                <span>{getServiceName(service, i18n.language)}</span>
                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">{service.category_id}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* POST Demo: Create Service */}
            {isProvider ? (
                <div className="border-t pt-4">
                    <h3 className="text-xl font-bold mb-3">Create Service (POST)</h3>
                    <form onSubmit={handleCreateService} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Service Title"
                            className="w-full p-2 border rounded"
                            value={newService.title}
                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Add Service
                        </button>
                    </form>
                </div>
            ) : (
                isAuthenticated && (
                    <div className="border-t pt-4 text-center text-gray-500 italic">
                        You must be a <strong>Provider</strong> to add services.
                    </div>
                )
            )}
        </div>
    );
};

export default ApiDemo;
