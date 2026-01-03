import api from './api';

/**
 * Transform frontend exam data to backend format (camelCase → snake_case)
 * Note: type is passed through directly since backend accepts frontend values
 */
const transformExamForBackend = (data) => ({
    module_id: data.moduleId,
    date: data.date,
    start_time: data.startTime,
    duration: data.duration,
    type: data.type, // Backend accepts: Written, Oral, Practical, TP, final, midterm, quiz, practical
    notes: data.notes,
    room_ids: data.roomIds || [],
    surveillant_ids: data.surveillantIds || [],
    group_ids: data.groupIds || [],
});

/**
 * Exam API service
 * Provides CRUD operations for exams with data transformation
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
     * @param {Object} data - Exam data (uses frontend camelCase format)
     * @returns {Promise} API response with created exam
     */
    create: (data) => {
        const payload = transformExamForBackend(data);
        return api.post('/exams', payload);
    },

    /**
     * Update an existing exam
     * @param {number} id - Exam ID
     * @param {Object} data - Updated exam data (uses frontend camelCase format)
     * @returns {Promise} API response with updated exam
     */
    update: (id, data) => {
        const payload = transformExamForBackend(data);
        return api.put(`/exams/${id}`, payload);
    },

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
