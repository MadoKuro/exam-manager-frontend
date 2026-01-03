import api from './api';

/**
 * Transform student data from frontend camelCase to backend snake_case
 */
const transformStudentForBackend = (data) => ({
    name: data.name,
    email: data.email,
    student_number: data.studentNumber,
    group_id: data.groupId,
    specialization_id: data.specializationId,
});

/**
 * Transform student data from backend snake_case to frontend camelCase
 */
const transformStudentFromBackend = (data) => ({
    id: data.id,
    name: data.name,
    email: data.email,
    studentNumber: data.student_number,
    groupId: data.group_id,
    group: data.group,
    specializationId: data.specialization_id,
    specialization: data.specialization,
    enrollmentDate: data.enrollment_date,
    // Derive levelId from group if available
    levelId: data.group?.level_id,
});

/**
 * Student API service
 * Provides CRUD operations for students
 */
export const studentService = {
    /**
     * Get all students
     * @param {Object} params - Optional query parameters
     * @returns {Promise} API response with students array
     */
    getAll: async (params = {}) => {
        const response = await api.get('/students', { params });
        // Transform response data
        if (response.data?.data) {
            response.data.data = response.data.data.map(transformStudentFromBackend);
        }
        return response;
    },

    /**
     * Get a single student by ID
     * @param {number} id - Student ID
     * @returns {Promise} API response with student object
     */
    getById: async (id) => {
        const response = await api.get(`/students/${id}`);
        if (response.data?.data) {
            response.data.data = transformStudentFromBackend(response.data.data);
        }
        return response;
    },

    /**
     * Create a new student
     * @param {Object} data - Student data
     * @returns {Promise} API response with created student
     */
    create: async (data) => {
        const response = await api.post('/students', transformStudentForBackend(data));
        if (response.data?.data) {
            response.data.data = transformStudentFromBackend(response.data.data);
        }
        return response;
    },

    /**
     * Update an existing student
     * @param {number} id - Student ID
     * @param {Object} data - Updated student data
     * @returns {Promise} API response with updated student
     */
    update: async (id, data) => {
        const response = await api.put(`/students/${id}`, transformStudentForBackend(data));
        if (response.data?.data) {
            response.data.data = transformStudentFromBackend(response.data.data);
        }
        return response;
    },

    /**
     * Delete a student
     * @param {number} id - Student ID
     * @returns {Promise} API response
     */
    delete: (id) => api.delete(`/students/${id}`),

    /**
     * Import multiple students
     * @param {Array} students - Array of student objects
     * @returns {Promise} API response
     */
    import: (students) => api.post('/students/import', {
        students: students.map(transformStudentForBackend)
    }),
};
