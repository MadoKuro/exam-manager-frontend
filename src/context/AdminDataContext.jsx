import { createContext, useContext, useState } from 'react';

const AdminDataContext = createContext();

export const useAdminData = () => {
    const context = useContext(AdminDataContext);
    if (!context) {
        throw new Error('useAdminData must be used within AdminDataProvider');
    }
    return context;
};

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
        // CRUD operations
        yearsCrud: createCrud(years, setYears),
        semestersCrud: createCrud(semesters, setSemesters),
        levelsCrud: createCrud(levels, setLevels),
        groupsCrud: createCrud(groups, setGroups),
        teachersCrud: createCrud(teachers, setTeachers),
        studentsCrud: createCrud(students, setStudents),
        modulesCrud: createCrud(modules, setModules),
        roomsCrud: createCrud(rooms, setRooms),
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
