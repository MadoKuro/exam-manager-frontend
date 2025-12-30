/**
 * Shared helper functions for exam-related pages
 * Used by PlanningView, ExamsList, and ConvocationsList
 */

/**
 * Get module name by ID
 */
export const getModuleName = (moduleId, modules) => {
    return modules.find(m => m.id === moduleId)?.name || '-';
};

/**
 * Get module code by ID
 */
export const getModuleCode = (moduleId, modules) => {
    return modules.find(m => m.id === moduleId)?.code || '-';
};

/**
 * Get comma-separated room names from array of IDs
 */
export const getRoomNames = (roomIds, rooms) => {
    if (!roomIds || roomIds.length === 0) return '-';
    return roomIds.map(id => rooms.find(r => r.id === id)?.name).filter(Boolean).join(', ');
};

/**
 * Get comma-separated surveillant names from array of IDs
 */
export const getSurveillantNames = (surveillantIds, teachers) => {
    if (!surveillantIds || surveillantIds.length === 0) return '-';
    return surveillantIds.map(id => teachers.find(t => t.id === id)?.name).filter(Boolean).join(', ');
};

/**
 * Get comma-separated group names from array of IDs
 */
export const getGroupNames = (groupIds, groups) => {
    if (!groupIds || groupIds.length === 0) return '-';
    return groupIds.map(id => groups.find(g => g.id === id)?.name).filter(Boolean).join(', ');
};

/**
 * Get responsible teacher name for a module
 */
export const getResponsibleTeacher = (moduleId, modules, teachers) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return '-';
    return teachers.find(t => t.id === mod.teacherId)?.name || '-';
};

/**
 * Get responsible teacher object for a module
 */
export const getResponsibleTeacherObj = (moduleId, modules, teachers) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return null;
    return teachers.find(t => t.id === mod.teacherId) || null;
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
};

/**
 * Get surveillant count from IDs array
 */
export const getSurveillantCount = (surveillantIds) => {
    return surveillantIds?.length || 0;
};

/**
 * Count students for exam based on groups
 */
export const getStudentCount = (groupIds, students) => {
    if (!groupIds || groupIds.length === 0) return 0;
    return students.filter(s => groupIds.includes(s.groupId)).length;
};
