import api from './api';

/**
 * Transform frontend room data to backend format
 * Maps 'location' to 'building' for backend compatibility
 */
const transformRoomForBackend = (data) => ({
    name: data.name,
    building: data.location || data.building, // Accept either field name
    capacity: data.capacity,
    type: data.type || 'classroom',
});

/**
 * Transform backend room data to frontend format
 * Maps 'building' to 'location' for frontend compatibility
 */
const transformRoomFromBackend = (room) => ({
    ...room,
    location: room.building || room.location, // Ensure location is available
});

/**
 * Room API service
 * Provides CRUD operations for rooms with data transformation
 */
export const roomService = {
    /**
     * Get all rooms
     * @param {Object} params - Optional query parameters
     * @returns {Promise} API response with rooms array
     */
    getAll: async (params = {}) => {
        const response = await api.get('/rooms', { params });
        // Transform each room to include 'location' field
        if (response.data?.data) {
            response.data.data = response.data.data.map(transformRoomFromBackend);
        }
        return response;
    },

    /**
     * Get a single room by ID
     * @param {number} id - Room ID
     * @returns {Promise} API response with room object
     */
    getById: async (id) => {
        const response = await api.get(`/rooms/${id}`);
        if (response.data?.data) {
            response.data.data = transformRoomFromBackend(response.data.data);
        }
        return response;
    },

    /**
     * Create a new room
     * @param {Object} data - Room data
     * @returns {Promise} API response with created room
     */
    create: (data) => {
        const payload = transformRoomForBackend(data);
        return api.post('/rooms', payload);
    },

    /**
     * Update an existing room
     * @param {number} id - Room ID
     * @param {Object} data - Updated room data
     * @returns {Promise} API response with updated room
     */
    update: (id, data) => {
        const payload = transformRoomForBackend(data);
        return api.put(`/rooms/${id}`, payload);
    },

    /**
     * Delete a room
     * @param {number} id - Room ID
     * @returns {Promise} API response
     */
    delete: (id) => api.delete(`/rooms/${id}`),

    /**
     * Import multiple rooms
     * @param {Array} rooms - Array of room objects
     * @returns {Promise} API response
     */
    import: (rooms) => {
        const payload = rooms.map(transformRoomForBackend);
        return api.post('/rooms/import', { rooms: payload });
    },
};
