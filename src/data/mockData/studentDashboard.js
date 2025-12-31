/**
 * Mock data for student dashboard
 */
export const studentDashboardData = {
    nextExam: {
        module: 'Algorithmics 2',
        date: '12 Jan 2026',
        time: '10:00 - 12:00',
        room: 'Room 23',
        teacher: 'Mr. X',
    },
    notifications: [
        { id: 1, title: 'Room Change', message: 'Algo 2 exam moved to Room 23', date: '2 hrs ago', type: 'warning' },
        { id: 2, title: 'New Exam Added', message: 'Database final exam scheduled', date: '1 day ago', type: 'info' },
    ],
    modules: [
        { name: 'Algorithmics 2', teacher: 'Mr. X' },
        { name: 'Web Development', teacher: 'Mrs. Y' },
        { name: 'Databases', teacher: 'Mr. Z' },
        { name: 'Mathematics', teacher: 'Mrs. A' },
    ],
};
