import api from './api';

/**
 * Exam API service
 * Provides CRUD operations for exams
 */
export const examService = {
    /**
     * Get all exams
     * @param {Object} params - Optional query parameters (filters, pagination)
     * @returns {Promise} API response with exams array
     */
    getAll: (params = {}) => api.get('/exams', { params }),

    /**
     * Get a single exam by ID
     * @param {number} id - Exam ID
     * @returns {Promise} API response with exam object
     */
    getById: (id) => api.get(`/exams/${id}`),

    /**
     * Create a new exam
     * @param {Object} data - Exam data
     * @returns {Promise} API response with created exam
     */
    create: (data) => api.post('/exams', data),

    /**
     * Update an existing exam
     * @param {number} id - Exam ID
     * @param {Object} data - Updated exam data
     * @returns {Promise} API response with updated exam
     */
    update: (id, data) => api.put(`/exams/${id}`, data),

    /**
     * Delete an exam
     * @param {number} id - Exam ID
     * @returns {Promise} API response
     */
    delete: (id) => api.delete(`/exams/${id}`),

    /**
     * Assign surveillants to an exam
     * @param {number} id - Exam ID
     * @param {Array} surveillantIds - Array of teacher IDs
     * @returns {Promise} API response
     */
    assignSurveillants: (id, surveillantIds) =>
        api.post(`/exams/${id}/surveillants`, { surveillant_ids: surveillantIds }),

    /**
     * Get exams by date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise} API response with exams array
     */
    getByDateRange: (startDate, endDate) =>
        api.get('/exams', { params: { start_date: startDate, end_date: endDate } }),
};
