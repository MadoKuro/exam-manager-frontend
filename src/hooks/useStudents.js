import { useEntityCrud } from './useEntityCrud';
import { initialStudents } from '../data/mockData';

/**
 * Hook for managing students data
 * 
 * @returns {Object} - { students, studentsCrud }
 */
export function useStudents() {
    const { items, crud, bulkImport } = useEntityCrud(initialStudents);

    return {
        students: items,
        studentsCrud: crud,
        importStudents: bulkImport,
    };
}
