import { useEntityCrud } from './useEntityCrud';
import { initialModules } from '../data/mockData';

/**
 * Hook for managing modules data
 * 
 * @returns {Object} - { modules, modulesCrud, importModules }
 */
export function useModules() {
    const { items, crud, bulkImport } = useEntityCrud(initialModules);

    return {
        modules: items,
        modulesCrud: crud,
        importModules: bulkImport,
    };
}
