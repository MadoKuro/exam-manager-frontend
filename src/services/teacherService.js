import api from './api';

/**
 * Teacher API service
 * Provides CRUD operations for teachers
 * Currently returns promises for future API integration
 */
export const teacherService = {
    /**
     * Get all teachers
     * @returns {Promise} API response with teachers array
     */
    getAll: () => api.get('/teachers'),

    /**
     * Get a single teacher by ID
     * @param {number} id - Teacher ID
     * @returns {Promise} API response with teacher object
     */
    getById: (id) => api.get(`/teachers/${id}`),

    /**
     * Create a new teacher
     * @param {Object} data - Teacher data
     * @returns {Promise} API response with created teacher
     */
    create: (data) => api.post('/teachers', data),

    /**
     * Update an existing teacher
     * @param {number} id - Teacher ID
     * @param {Object} data - Updated teacher data
     * @returns {Promise} API response with updated teacher
     */
    update: (id, data) => api.put(`/teachers/${id}`, data),

    /**
     * Delete a teacher
     * @param {number} id - Teacher ID
     * @returns {Promise} API response
     */
    delete: (id) => api.delete(`/teachers/${id}`),
};
