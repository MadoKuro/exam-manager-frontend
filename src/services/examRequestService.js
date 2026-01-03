import api from './api';

/**
 * Exam Request API service
 * Provides operations for exam requests (teacher requests, admin approval)
 */
export const examRequestService = {
    /**
     * Get all exam requests (filtered by role on backend)
     * @param {Object} params - Optional query parameters
     * @returns {Promise} API response with requests array
     */
    getAll: (params = {}) => api.get('/exam-requests', { params }),

    /**
     * Get a single exam request by ID
     * @param {number} id - Request ID
     * @returns {Promise} API response with request object
     */
    getById: (id) => api.get(`/exam-requests/${id}`),

    /**
     * Create a new exam request (teacher only)
     * @param {Object} data - Request data (module_name, date, time, duration, room)
     * @returns {Promise} API response with created request
     */
    create: (data) => api.post('/exam-requests', data),

    /**
     * Update request status (admin only)
     * @param {number} id - Request ID
     * @param {string} status - 'Approved' or 'Refused'
     * @param {string|null} refusalReason - Reason if refused
     * @returns {Promise} API response
     */
    updateStatus: (id, status, refusalReason = null) =>
        api.patch(`/exam-requests/${id}/status`, {
            status,
            refusal_reason: refusalReason,
        }),
};
