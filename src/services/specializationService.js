import api from './api';

/**
 * Specialization API service
 * Provides CRUD operations for specializations
 */
export const specializationService = {
    /**
     * Get all specializations
     * @returns {Promise} API response with specializations array
     */
    getAll: () => api.get('/specializations'),

    /**
     * Get a single specialization by ID
     * @param {number} id - Specialization ID
     * @returns {Promise} API response with specialization object
     */
    getById: (id) => api.get(`/specializations/${id}`),

    /**
     * Create a new specialization
     * @param {Object} data - Specialization data
     * @returns {Promise} API response with created specialization
     */
    create: (data) => api.post('/specializations', data),

    /**
     * Update an existing specialization
     * @param {number} id - Specialization ID
     * @param {Object} data - Updated specialization data
     * @returns {Promise} API response with updated specialization
     */
    update: (id, data) => api.put(`/specializations/${id}`, data),

    /**
     * Delete a specialization
     * @param {number} id - Specialization ID
     * @returns {Promise} API response
     */
    delete: (id) => api.delete(`/specializations/${id}`),
};
