import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    teacherService,
    studentService,
    moduleService,
    roomService,
    academicService,
    examService,
    specializationService,
} from '../services';

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
 * Fetches data from API only when user is authenticated
 */
export const AdminDataProvider = ({ children }) => {
    const { user } = useAuth();

    // State for all entities
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [modules, setModules] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [years, setYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [levels, setLevels] = useState([]);
    const [groups, setGroups] = useState([]);
    const [exams, setExams] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true); // Start as true since we need to fetch
    const [dataReady, setDataReady] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch all data when user logs in
    useEffect(() => {
        if (user) {
            fetchAllData();
        } else {
            // Clear data on logout
            setTeachers([]);
            setStudents([]);
            setModules([]);
            setRooms([]);
            setYears([]);
            setSemesters([]);
            setLevels([]);
            setGroups([]);
            setExams([]);
            setSpecializations([]);
            setDataReady(false);
            setLoading(false);
        }
    }, [user]);

    const fetchAllData = async (retryCount = 0) => {
        setLoading(true);
        setDataReady(false);
        const newErrors = {};

        try {
            const results = await Promise.allSettled([
                teacherService.getAll(),
                studentService.getAll(),
                moduleService.getAll(),
                roomService.getAll(),
                academicService.getYears(),
                academicService.getSemesters(),
                academicService.getLevels(),
                academicService.getGroups(),
                examService.getAll(),
                specializationService.getAll(),
            ]);

            const [
                teachersRes, studentsRes, modulesRes, roomsRes,
                yearsRes, semestersRes, levelsRes, groupsRes, examsRes, specializationsRes
            ] = results;

            // Process each result and track errors
            if (teachersRes.status === 'fulfilled') {
                setTeachers(teachersRes.value.data?.data || []);
            } else {
                newErrors.teachers = teachersRes.reason?.message || 'Failed to fetch teachers';
                console.error('Teachers fetch error:', teachersRes.reason);
            }

            if (studentsRes.status === 'fulfilled') {
                setStudents(studentsRes.value.data?.data || []);
            } else {
                newErrors.students = studentsRes.reason?.message || 'Failed to fetch students';
                console.error('Students fetch error:', studentsRes.reason);
            }

            if (modulesRes.status === 'fulfilled') {
                setModules(modulesRes.value.data?.data || []);
            } else {
                newErrors.modules = modulesRes.reason?.message || 'Failed to fetch modules';
                console.error('Modules fetch error:', modulesRes.reason);
            }

            if (roomsRes.status === 'fulfilled') {
                setRooms(roomsRes.value.data?.data || []);
            } else {
                newErrors.rooms = roomsRes.reason?.message || 'Failed to fetch rooms';
                console.error('Rooms fetch error:', roomsRes.reason);
            }

            if (yearsRes.status === 'fulfilled') {
                setYears(yearsRes.value.data?.data || []);
            } else {
                newErrors.years = yearsRes.reason?.message || 'Failed to fetch years';
            }

            if (semestersRes.status === 'fulfilled') {
                setSemesters(semestersRes.value.data?.data || []);
            } else {
                newErrors.semesters = semestersRes.reason?.message || 'Failed to fetch semesters';
            }

            if (levelsRes.status === 'fulfilled') {
                setLevels(levelsRes.value.data?.data || []);
            } else {
                newErrors.levels = levelsRes.reason?.message || 'Failed to fetch levels';
            }

            if (groupsRes.status === 'fulfilled') {
                setGroups(groupsRes.value.data?.data || []);
            } else {
                newErrors.groups = groupsRes.reason?.message || 'Failed to fetch groups';
                console.error('Groups fetch error:', groupsRes.reason);
            }

            if (examsRes.status === 'fulfilled') {
                setExams(examsRes.value.data?.data || []);
            } else {
                newErrors.exams = examsRes.reason?.message || 'Failed to fetch exams';
                console.error('Exams fetch error:', examsRes.reason);
            }

            if (specializationsRes.status === 'fulfilled') {
                setSpecializations(specializationsRes.value.data?.data || []);
            } else {
                newErrors.specializations = specializationsRes.reason?.message || 'Failed to fetch specializations';
                console.error('Specializations fetch error:', specializationsRes.reason);
            }

            setErrors(newErrors);

            // If too many errors and haven't retried yet, retry once
            const errorCount = Object.keys(newErrors).length;
            if (errorCount > 3 && retryCount < 1) {
                console.log('Multiple fetch errors, retrying in 1 second...');
                setTimeout(() => fetchAllData(retryCount + 1), 1000);
                return;
            }

            setDataReady(true);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            // Retry once on complete failure
            if (retryCount < 1) {
                console.log('Fetch failed, retrying in 1 second...');
                setTimeout(() => fetchAllData(retryCount + 1), 1000);
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    // CRUD operations for teachers
    const teachersCrud = useMemo(() => ({
        add: async (data) => {
            const res = await teacherService.create(data);
            setTeachers(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await teacherService.update(id, data);
            setTeachers(prev => prev.map(t => t.id === id ? res.data.data : t));
            return res.data.data;
        },
        remove: async (id) => {
            await teacherService.delete(id);
            setTeachers(prev => prev.filter(t => t.id !== id));
        },
        getById: (id) => teachers.find(t => t.id === id),
    }), [teachers]);

    // CRUD operations for students
    const studentsCrud = useMemo(() => ({
        add: async (data) => {
            const res = await studentService.create(data);
            setStudents(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await studentService.update(id, data);
            setStudents(prev => prev.map(s => s.id === id ? res.data.data : s));
            return res.data.data;
        },
        remove: async (id) => {
            await studentService.delete(id);
            setStudents(prev => prev.filter(s => s.id !== id));
        },
        getById: (id) => students.find(s => s.id === id),
    }), [students]);

    // CRUD operations for modules
    const modulesCrud = useMemo(() => ({
        add: async (data) => {
            const res = await moduleService.create(data);
            setModules(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await moduleService.update(id, data);
            setModules(prev => prev.map(m => m.id === id ? res.data.data : m));
            return res.data.data;
        },
        remove: async (id) => {
            await moduleService.delete(id);
            setModules(prev => prev.filter(m => m.id !== id));
        },
        getById: (id) => modules.find(m => m.id === id),
    }), [modules]);

    // CRUD operations for rooms
    const roomsCrud = useMemo(() => ({
        add: async (data) => {
            const res = await roomService.create(data);
            setRooms(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await roomService.update(id, data);
            setRooms(prev => prev.map(r => r.id === id ? res.data.data : r));
            return res.data.data;
        },
        remove: async (id) => {
            await roomService.delete(id);
            setRooms(prev => prev.filter(r => r.id !== id));
        },
        getById: (id) => rooms.find(r => r.id === id),
    }), [rooms]);

    // CRUD operations for exams
    const examsCrud = useMemo(() => ({
        add: async (data) => {
            const res = await examService.create(data);
            setExams(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await examService.update(id, data);
            setExams(prev => prev.map(e => e.id === id ? res.data.data : e));
            return res.data.data;
        },
        remove: async (id) => {
            await examService.delete(id);
            setExams(prev => prev.filter(e => e.id !== id));
        },
        getById: (id) => exams.find(e => e.id === id),
    }), [exams]);

    // CRUD for academic entities
    const yearsCrud = useMemo(() => ({
        add: async (data) => {
            const res = await academicService.createYear(data);
            setYears(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await academicService.updateYear(id, data);
            setYears(prev => prev.map(y => y.id === id ? res.data.data : y));
            return res.data.data;
        },
        remove: async (id) => {
            await academicService.deleteYear(id);
            setYears(prev => prev.filter(y => y.id !== id));
        },
        getById: (id) => years.find(y => y.id === id),
    }), [years]);

    const semestersCrud = useMemo(() => ({
        add: async (data) => {
            const res = await academicService.createSemester(data);
            setSemesters(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await academicService.updateSemester(id, data);
            setSemesters(prev => prev.map(s => s.id === id ? res.data.data : s));
            return res.data.data;
        },
        remove: async (id) => {
            await academicService.deleteSemester(id);
            setSemesters(prev => prev.filter(s => s.id !== id));
        },
        getById: (id) => semesters.find(s => s.id === id),
    }), [semesters]);

    const levelsCrud = useMemo(() => ({
        add: async (data) => {
            const res = await academicService.createLevel(data);
            setLevels(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await academicService.updateLevel(id, data);
            setLevels(prev => prev.map(l => l.id === id ? res.data.data : l));
            return res.data.data;
        },
        remove: async (id) => {
            await academicService.deleteLevel(id);
            setLevels(prev => prev.filter(l => l.id !== id));
        },
        getById: (id) => levels.find(l => l.id === id),
    }), [levels]);

    const groupsCrud = useMemo(() => ({
        add: async (data) => {
            const res = await academicService.createGroup(data);
            setGroups(prev => [...prev, res.data.data]);
            return res.data.data;
        },
        update: async (id, data) => {
            const res = await academicService.updateGroup(id, data);
            setGroups(prev => prev.map(g => g.id === id ? res.data.data : g));
            return res.data.data;
        },
        remove: async (id) => {
            await academicService.deleteGroup(id);
            setGroups(prev => prev.filter(g => g.id !== id));
        },
        getById: (id) => groups.find(g => g.id === id),
    }), [groups]);

    // Import functions
    const importTeachers = useCallback(async (data) => {
        const res = await teacherService.import(data);
        setTeachers(prev => [...prev, ...res.data.data]);
        return res.data.data;
    }, []);

    const importStudents = useCallback(async (data) => {
        const res = await studentService.import(data);
        setStudents(prev => [...prev, ...res.data.data]);
        return res.data.data;
    }, []);

    const importModules = useCallback(async (data) => {
        const res = await moduleService.import(data);
        setModules(prev => [...prev, ...res.data.data]);
        return res.data.data;
    }, []);

    const importRooms = useCallback(async (data) => {
        const res = await roomService.import(data);
        setRooms(prev => [...prev, ...res.data.data]);
        return res.data.data;
    }, []);

    // Conflict detection helpers (kept for compatibility)
    const checkRoomConflicts = useCallback(() => [], []);
    const checkTeacherConflicts = useCallback(() => [], []);
    const checkSurveillantConflicts = useCallback(() => [], []);
    const getAvailableSurveillants = useCallback(() => teachers, [teachers]);
    const autoAssignSurveillants = useCallback(() => [], []);

    const value = {
        // Data
        years, semesters, levels, groups,
        teachers, students, modules, rooms, exams, specializations,

        // CRUD
        yearsCrud, semestersCrud, levelsCrud, groupsCrud,
        teachersCrud, studentsCrud, modulesCrud, roomsCrud, examsCrud,

        // Conflict detection
        checkRoomConflicts, checkTeacherConflicts, checkSurveillantConflicts,
        getAvailableSurveillants, autoAssignSurveillants,

        // Import
        importModules, importRooms, importTeachers, importStudents,

        // Status
        loading, dataReady, errors, refetch: fetchAllData,
    };

    return (
        <AdminDataContext.Provider value={value}>
            {children}
        </AdminDataContext.Provider>
    );
};
