import { useEntityCrud } from './useEntityCrud';
import {
    initialYears,
    initialSemesters,
    initialLevels,
    initialGroups
} from '../data/mockData';

/**
 * Hook for managing academic data (years, semesters, levels, groups)
 * 
 * @returns {Object} - Academic entities and their CRUD operations
 */
export function useAcademic() {
    const yearsData = useEntityCrud(initialYears);
    const semestersData = useEntityCrud(initialSemesters);
    const levelsData = useEntityCrud(initialLevels);
    const groupsData = useEntityCrud(initialGroups);

    return {
        // Years
        years: yearsData.items,
        yearsCrud: yearsData.crud,

        // Semesters
        semesters: semestersData.items,
        semestersCrud: semestersData.crud,

        // Levels
        levels: levelsData.items,
        levelsCrud: levelsData.crud,

        // Groups
        groups: groupsData.items,
        groupsCrud: groupsData.crud,
    };
}
