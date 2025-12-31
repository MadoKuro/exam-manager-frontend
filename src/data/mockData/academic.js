/**
 * Mock data for academic entities (years, semesters, levels, groups)
 */
export const initialYears = [
    { id: 1, name: '2024-2025', startDate: '2024-09-01', endDate: '2025-06-30' },
    { id: 2, name: '2025-2026', startDate: '2025-09-01', endDate: '2026-06-30' },
];

export const initialSemesters = [
    { id: 1, name: 'Fall 2024', yearId: 1, startDate: '2024-09-01', endDate: '2025-01-15' },
    { id: 2, name: 'Spring 2025', yearId: 1, startDate: '2025-01-20', endDate: '2025-06-30' },
];

export const initialLevels = [
    { id: 1, name: 'License 1', code: 'L1' },
    { id: 2, name: 'License 2', code: 'L2' },
    { id: 3, name: 'License 3', code: 'L3' },
    { id: 4, name: 'Master 1', code: 'M1' },
    { id: 5, name: 'Master 2', code: 'M2' },
];

export const initialGroups = [
    { id: 1, name: 'Group A', levelId: 1, capacity: 30 },
    { id: 2, name: 'Group B', levelId: 1, capacity: 30 },
    { id: 3, name: 'Group A', levelId: 2, capacity: 25 },
];
