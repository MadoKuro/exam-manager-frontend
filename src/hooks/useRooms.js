import { useEntityCrud } from './useEntityCrud';
import { initialRooms } from '../data/mockData';

/**
 * Hook for managing rooms data
 * 
 * @returns {Object} - { rooms, roomsCrud, importRooms }
 */
export function useRooms() {
    const { items, crud, bulkImport } = useEntityCrud(initialRooms);

    return {
        rooms: items,
        roomsCrud: crud,
        importRooms: bulkImport,
    };
}
