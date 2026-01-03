import { useState, useEffect, useCallback } from 'react';
import { roomService } from '../services';

/**
 * Hook for managing rooms data with API integration
 * 
 * @returns {Object} - { rooms, roomsCrud, importRooms, loading, error }
 */
export function useRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch rooms on mount
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await roomService.getAll();
            setRooms(response.data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch rooms');
            console.error('Error fetching rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    const add = useCallback(async (roomData) => {
        try {
            const response = await roomService.create(roomData);
            const newRoom = response.data.data;
            setRooms(prev => [...prev, newRoom]);
            return newRoom;
        } catch (err) {
            console.error('Error creating room:', err);
            throw err;
        }
    }, []);

    const update = useCallback(async (id, updates) => {
        try {
            const response = await roomService.update(id, updates);
            const updatedRoom = response.data.data;
            setRooms(prev => prev.map(r => r.id === id ? updatedRoom : r));
            return updatedRoom;
        } catch (err) {
            console.error('Error updating room:', err);
            throw err;
        }
    }, []);

    const remove = useCallback(async (id) => {
        try {
            await roomService.delete(id);
            setRooms(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error('Error deleting room:', err);
            throw err;
        }
    }, []);

    const getById = useCallback((id) => {
        return rooms.find(r => r.id === id);
    }, [rooms]);

    const importRooms = useCallback(async (newRooms) => {
        try {
            const response = await roomService.import(newRooms);
            const imported = response.data.data;
            setRooms(prev => [...prev, ...imported]);
            return imported;
        } catch (err) {
            console.error('Error importing rooms:', err);
            throw err;
        }
    }, []);

    return {
        rooms,
        roomsCrud: {
            add,
            update,
            remove,
            getById,
        },
        importRooms,
        loading,
        error,
        refetch: fetchRooms,
    };
}
