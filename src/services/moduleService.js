import api from './api';

/**
 * Transform module data from frontend camelCase to backend snake_case
 */
const transformModuleForBackend = (data) => ({
    name: data.name,
    code: data.code,
    teacher_id: data.teacherId,
    level_id: data.levelId,
    credits: data.credits,
    description: data.description,
});

/**
 * Transform module data from backend to frontend camelCase
 * Note: Backend already provides both formats, but we normalize here
 */
const transformModuleFromBackend = (data) => ({
    id: data.id,
    name: data.name,
    code: data.code,
    teacherId: data.teacherId || data.teacher_id,
    teacherName: data.teacher_name,
    levelId: data.level_id,
    level: data.level,
    credits: data.credits,
    description: data.description,
});

/**
 * Module API service
 * Provides CRUD operations for modules
 */
export const moduleService = {
    /**
     * Get all modules
     * @param {Object} params - Optional query parameters
     * @returns {Promise} API response with modules array
     */
    getAll: async (params = {}) => {
        const response = await api.get('/modules', { params });
        if (response.data?.data) {
            response.data.data = response.data.data.map(transformModuleFromBackend);
        }
        return response;
    },

    /**
     * Get a single module by ID
     * @param {number} id - Module ID
     * @returns {Promise} API response with module object
     */
    getById: async (id) => {
        const response = await api.get(`/modules/${id}`);
        if (response.data?.data) {
            response.data.data = transformModuleFromBackend(response.data.data);
        }
        return response;
    },

    /**
     * Create a new module
     * @param {Object} data - Module data
     * @returns {Promise} API response with created module
     */
    create: async (data) => {
        const response = await api.post('/modules', transformModuleForBackend(data));
        if (response.data?.data) {
            response.data.data = transformModuleFromBackend(response.data.data);
        }
        return response;
    },

    /**
     * Update an existing module
     * @param {number} id - Module ID
     * @param {Object} data - Updated module data
     * @returns {Promise} API response with updated module
     */
    update: async (id, data) => {
        const response = await api.put(`/modules/${id}`, transformModuleForBackend(data));
        if (response.data?.data) {
            response.data.data = transformModuleFromBackend(response.data.data);
        }
        return response;
    },

    /**
     * Delete a module
     * @param {number} id - Module ID
     * @returns {Promise} API response
     */
    delete: (id) => api.delete(`/modules/${id}`),

    /**
     * Import multiple modules
     * @param {Array} modules - Array of module objects
     * @returns {Promise} API response
     */
    import: (modules) => api.post('/modules/import', {
        modules: modules.map(transformModuleForBackend)
    }),
};
