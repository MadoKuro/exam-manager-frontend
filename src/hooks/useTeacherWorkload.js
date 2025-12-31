import { useMemo, useCallback } from 'react';

/**
 * Hook for calculating teacher workload and availability
 * 
 * @param {Array} teachers - List of teacher objects
 * @param {Array} exams - List of exam objects
 * @param {Array} modules - List of module objects (for module name lookup)
 * @returns {Object} - Workload calculations and helper functions
 */
export function useTeacherWorkload(teachers, exams, modules = []) {
    // Calculate workload (number of exams assigned per teacher)
    const teacherWorkload = useMemo(() => {
        const workload = {};
        teachers.forEach(t => { workload[t.id] = 0; });
        exams.forEach(exam => {
            (exam.surveillantIds || []).forEach(id => {
                if (workload[id] !== undefined) workload[id]++;
            });
        });
        return workload;
    }, [teachers, exams]);

    // Get exams needing surveillants
    const examsNeedingSurveillants = useMemo(() => {
        return exams.filter(exam => !exam.surveillantIds || exam.surveillantIds.length === 0);
    }, [exams]);

    // Get teacher's assigned exams
    const getTeacherExams = useCallback((teacherId) => {
        return exams.filter(exam => exam.surveillantIds?.includes(teacherId));
    }, [exams]);

    // Get module name helper
    const getModuleName = useCallback((moduleId) => {
        return modules.find(m => m.id === moduleId)?.name || '-';
    }, [modules]);

    // Determine teacher status based on workload
    const getTeacherStatus = useCallback((teacherId) => {
        const workload = teacherWorkload[teacherId] || 0;
        if (workload > 3) return { status: 'busy', label: 'Busy' };
        if (workload > 0) return { status: 'partial', label: 'Partially Busy' };
        return { status: 'available', label: 'Available' };
    }, [teacherWorkload]);

    return {
        teacherWorkload,
        examsNeedingSurveillants,
        getTeacherExams,
        getModuleName,
        getTeacherStatus,
    };
}
