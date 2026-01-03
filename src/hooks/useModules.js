import { useState, useEffect, useCallback } from 'react';
import { moduleService } from '../services';

/**
 * Hook for managing modules data with API integration
 * 
 * @returns {Object} - { modules, modulesCrud, importModules, loading, error }
 */
export function useModules() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch modules on mount
    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await moduleService.getAll();
            setModules(response.data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch modules');
            console.error('Error fetching modules:', err);
        } finally {
            setLoading(false);
        }
    };

    const add = useCallback(async (moduleData) => {
        try {
            const response = await moduleService.create(moduleData);
            const newModule = response.data.data;
            setModules(prev => [...prev, newModule]);
            return newModule;
        } catch (err) {
            console.error('Error creating module:', err);
            throw err;
        }
    }, []);

    const update = useCallback(async (id, updates) => {
        try {
            const response = await moduleService.update(id, updates);
            const updatedModule = response.data.data;
            setModules(prev => prev.map(m => m.id === id ? updatedModule : m));
            return updatedModule;
        } catch (err) {
            console.error('Error updating module:', err);
            throw err;
        }
    }, []);

    const remove = useCallback(async (id) => {
        try {
            await moduleService.delete(id);
            setModules(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.error('Error deleting module:', err);
            throw err;
        }
    }, []);

    const getById = useCallback((id) => {
        return modules.find(m => m.id === id);
    }, [modules]);

    const importModules = useCallback(async (newModules) => {
        try {
            const response = await moduleService.import(newModules);
            const imported = response.data.data;
            setModules(prev => [...prev, ...imported]);
            return imported;
        } catch (err) {
            console.error('Error importing modules:', err);
            throw err;
        }
    }, []);

    return {
        modules,
        modulesCrud: {
            add,
            update,
            remove,
            getById,
        },
        importModules,
        loading,
        error,
        refetch: fetchModules,
    };
}
