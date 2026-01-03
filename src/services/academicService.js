import api from './api';

// ========== Transformation Functions ==========

/**
 * Transform year data from backend snake_case to frontend camelCase
 */
const transformYearFromBackend = (data) => ({
    id: data.id,
    name: data.name,
    startDate: data.start_date,
    endDate: data.end_date,
    isActive: data.is_active,
});

const transformYearForBackend = (data) => ({
    name: data.name,
    start_date: data.startDate,
    end_date: data.endDate,
    is_active: data.isActive,
});

/**
 * Transform semester data from backend snake_case to frontend camelCase
 */
const transformSemesterFromBackend = (data) => ({
    id: data.id,
    name: data.name,
    yearId: data.year_id,
    startDate: data.start_date,
    endDate: data.end_date,
});

const transformSemesterForBackend = (data) => ({
    name: data.name,
    year_id: data.yearId,
    start_date: data.startDate,
    end_date: data.endDate,
});

/**
 * Transform level data from backend snake_case to frontend camelCase
 */
const transformLevelFromBackend = (data) => ({
    id: data.id,
    name: data.name,
    code: data.code,
    semesterId: data.semester_id,
});

const transformLevelForBackend = (data) => ({
    name: data.name,
    code: data.code,
    semester_id: data.semesterId,
});

/**
 * Transform group data from backend snake_case to frontend camelCase
 */
const transformGroupFromBackend = (data) => ({
    id: data.id,
    name: data.name,
    levelId: data.level_id,
    capacity: data.capacity,
});

const transformGroupForBackend = (data) => ({
    name: data.name,
    level_id: data.levelId,
    capacity: data.capacity,
});

// ========== Helper for transforming responses ==========
const transformResponse = (response, transformFn) => {
    if (response.data?.data) {
        if (Array.isArray(response.data.data)) {
            response.data.data = response.data.data.map(transformFn);
        } else {
            response.data.data = transformFn(response.data.data);
        }
    }
    return response;
};

/**
 * Academic API service
 * Provides CRUD operations for years, semesters, levels, and groups
 */
export const academicService = {
    // ========== Years ==========
    getYears: async () => {
        const response = await api.get('/years');
        return transformResponse(response, transformYearFromBackend);
    },
    getYear: async (id) => {
        const response = await api.get(`/years/${id}`);
        return transformResponse(response, transformYearFromBackend);
    },
    createYear: async (data) => {
        const response = await api.post('/years', transformYearForBackend(data));
        return transformResponse(response, transformYearFromBackend);
    },
    updateYear: async (id, data) => {
        const response = await api.put(`/years/${id}`, transformYearForBackend(data));
        return transformResponse(response, transformYearFromBackend);
    },
    deleteYear: (id) => api.delete(`/years/${id}`),

    // ========== Semesters ==========
    getSemesters: async () => {
        const response = await api.get('/semesters');
        return transformResponse(response, transformSemesterFromBackend);
    },
    getSemester: async (id) => {
        const response = await api.get(`/semesters/${id}`);
        return transformResponse(response, transformSemesterFromBackend);
    },
    createSemester: async (data) => {
        const response = await api.post('/semesters', transformSemesterForBackend(data));
        return transformResponse(response, transformSemesterFromBackend);
    },
    updateSemester: async (id, data) => {
        const response = await api.put(`/semesters/${id}`, transformSemesterForBackend(data));
        return transformResponse(response, transformSemesterFromBackend);
    },
    deleteSemester: (id) => api.delete(`/semesters/${id}`),

    // ========== Levels ==========
    getLevels: async () => {
        const response = await api.get('/levels');
        return transformResponse(response, transformLevelFromBackend);
    },
    getLevel: async (id) => {
        const response = await api.get(`/levels/${id}`);
        return transformResponse(response, transformLevelFromBackend);
    },
    createLevel: async (data) => {
        const response = await api.post('/levels', transformLevelForBackend(data));
        return transformResponse(response, transformLevelFromBackend);
    },
    updateLevel: async (id, data) => {
        const response = await api.put(`/levels/${id}`, transformLevelForBackend(data));
        return transformResponse(response, transformLevelFromBackend);
    },
    deleteLevel: (id) => api.delete(`/levels/${id}`),

    // ========== Groups ==========
    getGroups: async () => {
        const response = await api.get('/groups');
        return transformResponse(response, transformGroupFromBackend);
    },
    getGroup: async (id) => {
        const response = await api.get(`/groups/${id}`);
        return transformResponse(response, transformGroupFromBackend);
    },
    createGroup: async (data) => {
        const response = await api.post('/groups', transformGroupForBackend(data));
        return transformResponse(response, transformGroupFromBackend);
    },
    updateGroup: async (id, data) => {
        const response = await api.put(`/groups/${id}`, transformGroupForBackend(data));
        return transformResponse(response, transformGroupFromBackend);
    },
    deleteGroup: (id) => api.delete(`/groups/${id}`),
};
