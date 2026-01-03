import { useState, useEffect, useCallback } from 'react';
import { examService } from '../services';

/**
 * Helper function to check if two time slots overlap
 */
const doTimesOverlap = (date1, start1, duration1, date2, start2, duration2) => {
    if (date1 !== date2) return false;

    const toMinutes = (time) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    };

    const start1Min = toMinutes(start1);
    const end1Min = start1Min + duration1;
    const start2Min = toMinutes(start2);
    const end2Min = start2Min + duration2;

    return start1Min < end2Min && start2Min < end1Min;
};

/**
 * Hook for managing exams data with conflict detection and API integration
 * 
 * @param {Object} dependencies - External dependencies (teachers, modules, rooms)
 * @returns {Object} - Exams data, CRUD, and conflict detection functions
 */
export function useExams({ teachers = [], modules = [], rooms = [] } = {}) {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch exams on mount
    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getAll();
            setExams(response.data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch exams');
            console.error('Error fetching exams:', err);
        } finally {
            setLoading(false);
        }
    };

    const add = useCallback(async (examData) => {
        try {
            const response = await examService.create(examData);
            const newExam = response.data.data;
            setExams(prev => [...prev, newExam]);
            return newExam;
        } catch (err) {
            console.error('Error creating exam:', err);
            throw err;
        }
    }, []);

    const update = useCallback(async (id, updates) => {
        try {
            const response = await examService.update(id, updates);
            const updatedExam = response.data.data;
            setExams(prev => prev.map(e => e.id === id ? updatedExam : e));
            return updatedExam;
        } catch (err) {
            console.error('Error updating exam:', err);
            throw err;
        }
    }, []);

    const remove = useCallback(async (id) => {
        try {
            await examService.delete(id);
            setExams(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            console.error('Error deleting exam:', err);
            throw err;
        }
    }, []);

    const getById = useCallback((id) => {
        return exams.find(e => e.id === id);
    }, [exams]);

    // Check for room conflicts
    const checkRoomConflicts = useCallback((date, startTime, duration, roomIds, excludeExamId = null) => {
        const conflicts = [];
        exams.forEach(exam => {
            if (excludeExamId && exam.id === excludeExamId) return;
            if (!doTimesOverlap(date, startTime, duration, exam.date, exam.startTime, exam.duration)) return;

            const conflictingRooms = roomIds.filter(roomId => exam.roomIds?.includes(roomId));
            if (conflictingRooms.length > 0) {
                const roomNames = conflictingRooms.map(id => rooms.find(r => r.id === id)?.name).filter(Boolean);
                const moduleName = modules.find(m => m.id === exam.moduleId)?.name || 'Unknown Module';
                conflicts.push({
                    type: 'room',
                    rooms: roomNames,
                    examId: exam.id,
                    examName: moduleName,
                    time: `${exam.date} at ${exam.startTime}`
                });
            }
        });
        return conflicts;
    }, [exams, rooms, modules]);

    // Check for teacher conflicts
    const checkTeacherConflicts = useCallback((date, startTime, duration, moduleId, excludeExamId = null) => {
        const conflicts = [];
        const module = modules.find(m => m.id === moduleId);
        if (!module) return conflicts;

        const responsibleTeacherId = module.teacherId;

        exams.forEach(exam => {
            if (excludeExamId && exam.id === excludeExamId) return;
            if (!doTimesOverlap(date, startTime, duration, exam.date, exam.startTime, exam.duration)) return;

            const examModule = modules.find(m => m.id === exam.moduleId);
            if (examModule && examModule.teacherId === responsibleTeacherId) {
                const teacherName = teachers.find(t => t.id === responsibleTeacherId)?.name || 'Unknown Teacher';
                const moduleName = examModule.name;
                conflicts.push({
                    type: 'teacher',
                    teacher: teacherName,
                    examId: exam.id,
                    examName: moduleName,
                    time: `${exam.date} at ${exam.startTime}`
                });
            }
        });
        return conflicts;
    }, [exams, teachers, modules]);

    // Check for surveillant conflicts
    const checkSurveillantConflicts = useCallback((date, startTime, duration, surveillantIds, excludeExamId = null) => {
        const conflicts = [];
        exams.forEach(exam => {
            if (excludeExamId && exam.id === excludeExamId) return;
            if (!doTimesOverlap(date, startTime, duration, exam.date, exam.startTime, exam.duration)) return;

            const conflictingSurveillants = surveillantIds.filter(id => exam.surveillantIds?.includes(id));
            if (conflictingSurveillants.length > 0) {
                const surveillantNames = conflictingSurveillants.map(id => teachers.find(t => t.id === id)?.name).filter(Boolean);
                const moduleName = modules.find(m => m.id === exam.moduleId)?.name || 'Unknown Module';
                conflicts.push({
                    type: 'surveillant',
                    surveillants: surveillantNames,
                    examId: exam.id,
                    examName: moduleName,
                    time: `${exam.date} at ${exam.startTime}`
                });
            }
        });
        return conflicts;
    }, [exams, teachers, modules]);

    // Get available surveillants for a time slot
    const getAvailableSurveillants = useCallback((date, startTime, duration, excludeExamId = null) => {
        const busyTeacherIds = new Set();

        exams.forEach(exam => {
            if (excludeExamId && exam.id === excludeExamId) return;
            if (!doTimesOverlap(date, startTime, duration, exam.date, exam.startTime, exam.duration)) return;
            (exam.surveillantIds || []).forEach(id => busyTeacherIds.add(id));
        });

        return teachers.filter(t => !busyTeacherIds.has(t.id));
    }, [exams, teachers]);

    // Auto-assign surveillants
    const autoAssignSurveillants = useCallback((examId, count = 1) => {
        const exam = exams.find(e => e.id === examId);
        if (!exam) return [];

        const available = getAvailableSurveillants(exam.date, exam.startTime, exam.duration, examId);
        // Exclude the module's responsible teacher
        const module = modules.find(m => m.id === exam.moduleId);
        const filtered = available.filter(t => t.id !== module?.teacherId);

        return filtered.slice(0, count).map(t => t.id);
    }, [exams, modules, getAvailableSurveillants]);

    return {
        exams,
        examsCrud: {
            add,
            update,
            remove,
            getById,
        },
        setExams,
        loading,
        error,
        refetch: fetchExams,
        // Conflict detection
        checkRoomConflicts,
        checkTeacherConflicts,
        checkSurveillantConflicts,
        getAvailableSurveillants,
        autoAssignSurveillants,
    };
}
