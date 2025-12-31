/**
 * Mock data for exams entity
 */
export const initialExams = [
    {
        id: 1,
        moduleId: 1,
        date: '2025-01-15',
        startTime: '09:00',
        duration: 120,
        type: 'Written',
        roomIds: [1, 2],
        groupIds: [1, 2],
        surveillantIds: [2, 3],
        status: 'Scheduled',
        createdAt: '2024-12-01'
    },
    {
        id: 2,
        moduleId: 2,
        date: '2025-01-16',
        startTime: '14:00',
        duration: 90,
        type: 'Written',
        roomIds: [4],
        groupIds: [1],
        surveillantIds: [1],
        status: 'Scheduled',
        createdAt: '2024-12-05'
    },
];

// Exam types constant
export const EXAM_TYPES = ['Written', 'Oral', 'Practical', 'Online'];
