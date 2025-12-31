import { useState, useCallback } from 'react';

/**
 * Generic CRUD hook factory
 * Creates a reusable set of CRUD operations for any entity type
 * 
 * @param {Array} initialData - Initial array of items
 * @param {string} idField - Field name for the unique identifier (default: 'id')
 * @returns {Object} - { items, setItems, add, update, remove, getById, bulkImport }
 */
export function useEntityCrud(initialData, idField = 'id') {
    const [items, setItems] = useState(initialData);

    // Add a new item with auto-generated ID
    const add = useCallback((item) => {
        const newId = Math.max(0, ...items.map(i => i[idField])) + 1;
        const newItem = { ...item, [idField]: newId };
        setItems(prev => [...prev, newItem]);
        return newItem;
    }, [items, idField]);

    // Update an existing item by ID
    const update = useCallback((id, updates) => {
        setItems(prev =>
            prev.map(item =>
                item[idField] === id ? { ...item, ...updates } : item
            )
        );
    }, [idField]);

    // Remove an item by ID
    const remove = useCallback((id) => {
        setItems(prev => prev.filter(item => item[idField] !== id));
    }, [idField]);

    // Get a single item by ID
    const getById = useCallback((id) => {
        return items.find(item => item[idField] === id);
    }, [items, idField]);

    // Bulk import multiple items
    const bulkImport = useCallback((newItems) => {
        const startId = Math.max(0, ...items.map(i => i[idField])) + 1;
        const withIds = newItems.map((item, index) => ({
            ...item,
            [idField]: startId + index
        }));
        setItems(prev => [...prev, ...withIds]);
        return withIds;
    }, [items, idField]);

    return {
        items,
        setItems,
        crud: {
            add,
            update,
            remove,
            getById,
        },
        bulkImport,
    };
}
