import { createContext, useContext, useState } from 'react';

const AdminDataContext = createContext();

export const useAdminData = () => {
    const context = useContext(AdminDataContext);
    if (!context) {
        throw new Error('useAdminData must be used within AdminDataProvider');
    }
    return context;
};

// Exam types constant
export const EXAM_TYPES = ['Written', 'Oral', 'Practical', 'Online'];

// Initial mock data
const initialData = {
    years: [
        { id: 1, name: '2024-2025', startDate: '2024-09-01', endDate: '2025-06-30' },
        { id: 2, name: '2025-2026', startDate: '2025-09-01', endDate: '2026-06-30' },
    ],
    semesters: [
        { id: 1, name: 'Fall 2024', yearId: 1, startDate: '2024-09-01', endDate: '2025-01-15' },
        { id: 2, name: 'Spring 2025', yearId: 1, startDate: '2025-01-20', endDate: '2025-06-30' },
    ],
    levels: [
        { id: 1, name: 'License 1', code: 'L1' },
        { id: 2, name: 'License 2', code: 'L2' },
        { id: 3, name: 'License 3', code: 'L3' },
        { id: 4, name: 'Master 1', code: 'M1' },
        { id: 5, name: 'Master 2', code: 'M2' },
    ],
    groups: [
        { id: 1, name: 'Group A', levelId: 1, capacity: 30 },
        { id: 2, name: 'Group B', levelId: 1, capacity: 30 },
        { id: 3, name: 'Group A', levelId: 2, capacity: 25 },
    ],
    teachers: [
        { id: 1, name: 'Dr. Ahmed Benali', email: 'ahmed.benali@uni.edu' },
        { id: 2, name: 'Dr. Sarah Mansouri', email: 'sarah.mansouri@uni.edu' },
        { id: 3, name: 'Prof. Karim Hadj', email: 'karim.hadj@uni.edu' },
    ],
    students: [
        { id: 1, name: 'Mohamed Amine', email: 'mohamed.amine@student.edu', levelId: 1, specialization: 'Computer Science', groupId: 1 },
        { id: 2, name: 'Fatima Zahra', email: 'fatima.zahra@student.edu', levelId: 1, specialization: 'Computer Science', groupId: 1 },
        { id: 3, name: 'Youssef Ali', email: 'youssef.ali@student.edu', levelId: 2, specialization: 'Information Systems', groupId: 3 },
    ],
    modules: [
        { id: 1, name: 'Algorithmics', code: 'ALG101', semesterId: 1, teacherId: 1 },
        { id: 2, name: 'Database Systems', code: 'DB201', semesterId: 1, teacherId: 2 },
        { id: 3, name: 'Web Development', code: 'WEB301', semesterId: 2, teacherId: 3 },
    ],
    rooms: [
        { id: 1, name: 'Room 101', capacity: 40, location: 'Building A, Floor 1' },
        { id: 2, name: 'Room 202', capacity: 30, location: 'Building A, Floor 2' },
        { id: 3, name: 'Lab 1', capacity: 25, location: 'Building B, Floor 1' },
        { id: 4, name: 'Amphitheater', capacity: 200, location: 'Main Building' },
    ],
    exams: [
        {
            id: 1,
            moduleId: 1,
            date: '2025-01-15',
            startTime: '09:00',
            duration: 120,
            type: 'Written',
            roomIds: [1, 2],
            groupIds: [1, 2],
            surveillantIds: [2, 3],
            status: 'Scheduled',
            createdAt: '2024-12-01'
        },
        {
            id: 2,
            moduleId: 2,
            date: '2025-01-16',
            startTime: '14:00',
            duration: 90,
            type: 'Written',
            roomIds: [4],
            groupIds: [1],
            surveillantIds: [1],
            status: 'Scheduled',
            createdAt: '2024-12-05'
        },
    ],
};

export const AdminDataProvider = ({ children }) => {
    const [years, setYears] = useState(initialData.years);
    const [semesters, setSemesters] = useState(initialData.semesters);
    const [levels, setLevels] = useState(initialData.levels);
    const [groups, setGroups] = useState(initialData.groups);
    const [teachers, setTeachers] = useState(initialData.teachers);
    const [students, setStudents] = useState(initialData.students);
    const [modules, setModules] = useState(initialData.modules);
    const [rooms, setRooms] = useState(initialData.rooms);
    const [exams, setExams] = useState(initialData.exams);

    // Generic CRUD helpers
    const createCrud = (items, setItems) => ({
        add: (item) => {
            const newItem = { ...item, id: Math.max(0, ...items.map(i => i.id)) + 1 };
            setItems([...items, newItem]);
            return newItem;
        },
        update: (id, updates) => {
            setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
        },
        remove: (id) => {
            setItems(items.filter(item => item.id !== id));
        },
        getById: (id) => items.find(item => item.id === id),
    });

    // Time overlap check helper
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

    // Conflict detection helpers
    const checkRoomConflicts = (date, startTime, duration, roomIds, excludeExamId = null) => {
        const conflicts = [];
        exams.forEach(exam => {
            if (excludeExamId && exam.id === excludeExamId) return;
            if (!doTimesOverlap(date, startTime, duration, exam.date, exam.startTime, exam.duration)) return;

            const conflictingRooms = roomIds.filter(roomId => exam.roomIds.includes(roomId));
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
    };

    const checkTeacherConflicts = (date, startTime, duration, moduleId, excludeExamId = null) => {
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
    };

    const checkSurveillantConflicts = (date, startTime, duration, surveillantIds, excludeExamId = null) => {
        const conflicts = [];
        exams.forEach(exam => {
            if (excludeExamId && exam.id === excludeExamId) return;
            if (!doTimesOverlap(date, startTime, duration, exam.date, exam.startTime, exam.duration)) return;

            const conflictingSurveillants = surveillantIds.filter(id => exam.surveillantIds.includes(id));
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
    };

    // Get available surveillants for a time slot
    const getAvailableSurveillants = (date, startTime, duration, excludeExamId = null) => {
        const busyTeacherIds = new Set();

        exams.forEach(exam => {
            if (excludeExamId && exam.id === excludeExamId) return;
            if (!doTimesOverlap(date, startTime, duration, exam.date, exam.startTime, exam.duration)) return;
            exam.surveillantIds.forEach(id => busyTeacherIds.add(id));
        });

        return teachers.filter(t => !busyTeacherIds.has(t.id));
    };

    // Auto-assign surveillants
    const autoAssignSurveillants = (examId, count = 1) => {
        const exam = exams.find(e => e.id === examId);
        if (!exam) return [];

        const available = getAvailableSurveillants(exam.date, exam.startTime, exam.duration, examId);
        // Exclude the module's responsible teacher
        const module = modules.find(m => m.id === exam.moduleId);
        const filtered = available.filter(t => t.id !== module?.teacherId);

        return filtered.slice(0, count).map(t => t.id);
    };

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
        yearsCrud: createCrud(years, setYears),
        semestersCrud: createCrud(semesters, setSemesters),
        levelsCrud: createCrud(levels, setLevels),
        groupsCrud: createCrud(groups, setGroups),
        teachersCrud: createCrud(teachers, setTeachers),
        studentsCrud: createCrud(students, setStudents),
        modulesCrud: createCrud(modules, setModules),
        roomsCrud: createCrud(rooms, setRooms),
        examsCrud: createCrud(exams, setExams),
        // Conflict detection
        checkRoomConflicts,
        checkTeacherConflicts,
        checkSurveillantConflicts,
        getAvailableSurveillants,
        autoAssignSurveillants,
        // Bulk import
        importModules: (newModules) => {
            const startId = Math.max(0, ...modules.map(m => m.id)) + 1;
            const withIds = newModules.map((m, i) => ({ ...m, id: startId + i }));
            setModules([...modules, ...withIds]);
        },
        importRooms: (newRooms) => {
            const startId = Math.max(0, ...rooms.map(r => r.id)) + 1;
            const withIds = newRooms.map((r, i) => ({ ...r, id: startId + i }));
            setRooms([...rooms, ...withIds]);
        },
    };

    return (
        <AdminDataContext.Provider value={value}>
            {children}
        </AdminDataContext.Provider>
    );
};
