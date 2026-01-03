import { useState, useEffect, useCallback } from 'react';
import { teacherService } from '../services';

/**
 * Hook for managing teachers data with API integration
 * 
 * @returns {Object} - { teachers, teachersCrud, importTeachers, loading, error }
 */
export function useTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch teachers on mount
    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await teacherService.getAll();
            setTeachers(response.data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch teachers');
            console.error('Error fetching teachers:', err);
        } finally {
            setLoading(false);
        }
    };

    const add = useCallback(async (teacherData) => {
        try {
            const response = await teacherService.create(teacherData);
            const newTeacher = response.data.data;
            setTeachers(prev => [...prev, newTeacher]);
            return newTeacher;
        } catch (err) {
            console.error('Error creating teacher:', err);
            throw err;
        }
    }, []);

    const update = useCallback(async (id, updates) => {
        try {
            const response = await teacherService.update(id, updates);
            const updatedTeacher = response.data.data;
            setTeachers(prev => prev.map(t => t.id === id ? updatedTeacher : t));
            return updatedTeacher;
        } catch (err) {
            console.error('Error updating teacher:', err);
            throw err;
        }
    }, []);

    const remove = useCallback(async (id) => {
        try {
            await teacherService.delete(id);
            setTeachers(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting teacher:', err);
            throw err;
        }
    }, []);

    const getById = useCallback((id) => {
        return teachers.find(t => t.id === id);
    }, [teachers]);

    const importTeachers = useCallback(async (newTeachers) => {
        try {
            const response = await teacherService.import(newTeachers);
            const imported = response.data.data;
            setTeachers(prev => [...prev, ...imported]);
            return imported;
        } catch (err) {
            console.error('Error importing teachers:', err);
            throw err;
        }
    }, []);

    return {
        teachers,
        teachersCrud: {
            add,
            update,
            remove,
            getById,
        },
        importTeachers,
        loading,
        error,
        refetch: fetchTeachers,
    };
}
