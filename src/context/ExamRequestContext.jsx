import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { examRequestService } from '../services';
import { useAuth } from './AuthContext';

const ExamRequestContext = createContext();

export const useExamRequests = () => {
    const context = useContext(ExamRequestContext);
    if (!context) {
        throw new Error('useExamRequests must be used within ExamRequestProvider');
    }
    return context;
};

export const ExamRequestProvider = ({ children }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch requests on mount and when user changes
    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examRequestService.getAll();
            setRequests(response.data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch exam requests');
            console.error('Error fetching exam requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const addRequest = useCallback(async (newRequest) => {
        try {
            // Map frontend fields to backend expected format
            const requestData = {
                module_name: newRequest.module,
                date: newRequest.date,
                time: newRequest.time,
                duration: parseInt(newRequest.duration, 10),
                room: newRequest.room,
            };
            const response = await examRequestService.create(requestData);
            const createdRequest = response.data.data;
            setRequests(prev => [createdRequest, ...prev]);
            return createdRequest;
        } catch (err) {
            console.error('Error creating exam request:', err);
            throw err;
        }
    }, []);

    const updateRequestStatus = useCallback(async (id, status, reason = null) => {
        try {
            const response = await examRequestService.updateStatus(id, status, reason);
            setRequests(prev => prev.map(req =>
                req.id === id
                    ? { ...req, status, refusalReason: reason }
                    : req
            ));
            return response.data.data;
        } catch (err) {
            console.error('Error updating request status:', err);
            throw err;
        }
    }, []);

    const value = {
        requests,
        addRequest,
        updateRequestStatus,
        loading,
        error,
        refetch: fetchRequests,
    };

    return (
        <ExamRequestContext.Provider value={value}>
            {children}
        </ExamRequestContext.Provider>
    );
};
