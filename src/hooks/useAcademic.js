import { useState, useEffect, useCallback } from 'react';
import { academicService } from '../services';

/**
 * Hook for managing academic data (years, semesters, levels, groups) with API integration
 * 
 * @returns {Object} - Academic entities and their CRUD operations
 */
export function useAcademic() {
    const [years, setYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [levels, setLevels] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all academic data on mount
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            setLoading(true);
            setError(null);
            const [yearsRes, semestersRes, levelsRes, groupsRes] = await Promise.all([
                academicService.getYears(),
                academicService.getSemesters(),
                academicService.getLevels(),
                academicService.getGroups(),
            ]);
            setYears(yearsRes.data.data);
            setSemesters(semestersRes.data.data);
            setLevels(levelsRes.data.data);
            setGroups(groupsRes.data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch academic data');
            console.error('Error fetching academic data:', err);
        } finally {
            setLoading(false);
        }
    };

    // ========== Years CRUD ==========
    const yearsCrud = {
        add: useCallback(async (data) => {
            const res = await academicService.createYear(data);
            setYears(prev => [...prev, res.data.data]);
            return res.data.data;
        }, []),
        update: useCallback(async (id, data) => {
            const res = await academicService.updateYear(id, data);
            setYears(prev => prev.map(y => y.id === id ? res.data.data : y));
            return res.data.data;
        }, []),
        remove: useCallback(async (id) => {
            await academicService.deleteYear(id);
            setYears(prev => prev.filter(y => y.id !== id));
        }, []),
        getById: useCallback((id) => years.find(y => y.id === id), [years]),
    };

    // ========== Semesters CRUD ==========
    const semestersCrud = {
        add: useCallback(async (data) => {
            const res = await academicService.createSemester(data);
            setSemesters(prev => [...prev, res.data.data]);
            return res.data.data;
        }, []),
        update: useCallback(async (id, data) => {
            const res = await academicService.updateSemester(id, data);
            setSemesters(prev => prev.map(s => s.id === id ? res.data.data : s));
            return res.data.data;
        }, []),
        remove: useCallback(async (id) => {
            await academicService.deleteSemester(id);
            setSemesters(prev => prev.filter(s => s.id !== id));
        }, []),
        getById: useCallback((id) => semesters.find(s => s.id === id), [semesters]),
    };

    // ========== Levels CRUD ==========
    const levelsCrud = {
        add: useCallback(async (data) => {
            const res = await academicService.createLevel(data);
            setLevels(prev => [...prev, res.data.data]);
            return res.data.data;
        }, []),
        update: useCallback(async (id, data) => {
            const res = await academicService.updateLevel(id, data);
            setLevels(prev => prev.map(l => l.id === id ? res.data.data : l));
            return res.data.data;
        }, []),
        remove: useCallback(async (id) => {
            await academicService.deleteLevel(id);
            setLevels(prev => prev.filter(l => l.id !== id));
        }, []),
        getById: useCallback((id) => levels.find(l => l.id === id), [levels]),
    };

    // ========== Groups CRUD ==========
    const groupsCrud = {
        add: useCallback(async (data) => {
            const res = await academicService.createGroup(data);
            setGroups(prev => [...prev, res.data.data]);
            return res.data.data;
        }, []),
        update: useCallback(async (id, data) => {
            const res = await academicService.updateGroup(id, data);
            setGroups(prev => prev.map(g => g.id === id ? res.data.data : g));
            return res.data.data;
        }, []),
        remove: useCallback(async (id) => {
            await academicService.deleteGroup(id);
            setGroups(prev => prev.filter(g => g.id !== id));
        }, []),
        getById: useCallback((id) => groups.find(g => g.id === id), [groups]),
    };

    return {
        years,
        yearsCrud,
        semesters,
        semestersCrud,
        levels,
        levelsCrud,
        groups,
        groupsCrud,
        loading,
        error,
        refetch: fetchAll,
    };
}
