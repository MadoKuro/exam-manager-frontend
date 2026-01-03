import api from './api';

/**
 * Notification API service
 * Provides operations for user notifications
 */
export const notificationService = {
    /**
     * Get all notifications for the current user
     * @returns {Promise} API response with notifications array
     */
    getAll: () => api.get('/notifications'),

    /**
     * Mark a notification as read
     * @param {number} id - Notification ID
     * @returns {Promise} API response
     */
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),

    /**
     * Mark all notifications as read
     * @returns {Promise} API response
     */
    markAllAsRead: () => api.post('/notifications/mark-all-read'),

    /**
     * Create a notification (admin only)
     * @param {Object} data - Notification data
     * @returns {Promise} API response
     */
    create: (data) => api.post('/notifications', data),
};
