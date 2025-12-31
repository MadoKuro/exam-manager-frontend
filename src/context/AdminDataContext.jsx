import { createContext, useContext } from 'react';
import {
    useTeachers,
    useStudents,
    useModules,
    useRooms,
    useAcademic,
    useExams
} from '../hooks';

// Re-export EXAM_TYPES from mock data for backward compatibility
export { EXAM_TYPES } from '../data/mockData';

const AdminDataContext = createContext();

/**
 * Hook to access admin data context
 * @throws {Error} If used outside AdminDataProvider
 */
export const useAdminData = () => {
    const context = useContext(AdminDataContext);
    if (!context) {
        throw new Error('useAdminData must be used within AdminDataProvider');
    }
    return context;
};

/**
 * Admin Data Provider
 * Composes all domain-specific hooks into a single context
 * This maintains backward compatibility while using the new modular hooks
 */
export const AdminDataProvider = ({ children }) => {
    // Use domain-specific hooks
    const { teachers, teachersCrud, importTeachers } = useTeachers();
    const { students, studentsCrud, importStudents } = useStudents();
    const { modules, modulesCrud, importModules } = useModules();
    const { rooms, roomsCrud, importRooms } = useRooms();
    const {
        years, yearsCrud,
        semesters, semestersCrud,
        levels, levelsCrud,
        groups, groupsCrud
    } = useAcademic();

    // Pass dependencies to useExams for conflict detection
    const {
        exams,
        examsCrud,
        checkRoomConflicts,
        checkTeacherConflicts,
        checkSurveillantConflicts,
        getAvailableSurveillants,
        autoAssignSurveillants
    } = useExams({ teachers, modules, rooms });

    // Compose all data into single context value
    const value = {
        // Data
        years,
        semesters,
        levels,
        groups,
        teachers,
        students,
        modules,
        rooms,
        exams,

        // CRUD operations
        yearsCrud,
        semestersCrud,
        levelsCrud,
        groupsCrud,
        teachersCrud,
        studentsCrud,
        modulesCrud,
        roomsCrud,
        examsCrud,

        // Conflict detection (from useExams)
        checkRoomConflicts,
        checkTeacherConflicts,
        checkSurveillantConflicts,
        getAvailableSurveillants,
        autoAssignSurveillants,

        // Bulk import
        importModules,
        importRooms,
        importTeachers,
        importStudents,
    };

    return (
        <AdminDataContext.Provider value={value}>
            {children}
        </AdminDataContext.Provider>
    );
};
