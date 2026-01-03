import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services';

/**
 * Hook for managing students data with API integration
 * 
 * @returns {Object} - { students, studentsCrud, importStudents, loading, error }
 */
export function useStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch students on mount
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentService.getAll();
            setStudents(response.data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch students');
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const add = useCallback(async (studentData) => {
        try {
            const response = await studentService.create(studentData);
            const newStudent = response.data.data;
            setStudents(prev => [...prev, newStudent]);
            return newStudent;
        } catch (err) {
            console.error('Error creating student:', err);
            throw err;
        }
    }, []);

    const update = useCallback(async (id, updates) => {
        try {
            const response = await studentService.update(id, updates);
            const updatedStudent = response.data.data;
            setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
            return updatedStudent;
        } catch (err) {
            console.error('Error updating student:', err);
            throw err;
        }
    }, []);

    const remove = useCallback(async (id) => {
        try {
            await studentService.delete(id);
            setStudents(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error('Error deleting student:', err);
            throw err;
        }
    }, []);

    const getById = useCallback((id) => {
        return students.find(s => s.id === id);
    }, [students]);

    const importStudents = useCallback(async (newStudents) => {
        try {
            const response = await studentService.import(newStudents);
            const imported = response.data.data;
            setStudents(prev => [...prev, ...imported]);
            return imported;
        } catch (err) {
            console.error('Error importing students:', err);
            throw err;
        }
    }, []);

    return {
        students,
        studentsCrud: {
            add,
            update,
            remove,
            getById,
        },
        importStudents,
        loading,
        error,
        refetch: fetchStudents,
    };
}
