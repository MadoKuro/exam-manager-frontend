import { useEntityCrud } from './useEntityCrud';
import { initialTeachers } from '../data/mockData';

/**
 * Hook for managing teachers data
 * 
 * @returns {Object} - { teachers, teachersCrud }
 */
export function useTeachers() {
    const { items, crud, bulkImport } = useEntityCrud(initialTeachers);

    return {
        teachers: items,
        teachersCrud: crud,
        importTeachers: bulkImport,
    };
}
