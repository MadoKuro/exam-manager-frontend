import { createContext, useContext, useState } from 'react';

const ExamRequestContext = createContext();

// Mock Rooms
const AVAILABLE_ROOMS = [
    { id: '101', name: 'Room 101 (Cap: 30)' },
    { id: '102', name: 'Room 102 (Cap: 30)' },
    { id: '201', name: 'Room 201 (Cap: 50)' },
    { id: 'LAB1', name: 'Computer Lab 1 (Cap: 20)' },
    { id: 'AMPHI_A', name: 'Amphitheater A (Cap: 200)' },
];

const initialRequests = [
    {
        id: 1,
        module: 'CS101',
        date: '2025-11-25',
        time: '09:00',
        duration: 120,
        room: '101',
        status: 'Pending',
        reason: ''
    },
    {
        id: 2,
        module: 'Databases',
        date: '2025-11-20',
        time: '14:00',
        duration: 90,
        room: 'LAB1',
        status: 'Refused',
        reason: 'Room unavailable'
    },
    {
        id: 3,
        module: 'ALG102',
        date: '2025-12-10',
        time: '09:00',
        duration: 120,
        room: '201',
        status: 'Approved',
        reason: ''
    }
];

export const ExamRequestProvider = ({ children }) => {
    const [requests, setRequests] = useState(initialRequests);

    const addRequest = (newRequest) => {
        const id = Math.max(...requests.map(r => r.id), 0) + 1;
        setRequests([...requests, { ...newRequest, id, status: 'Pending' }]);
    };

    const editRequest = (id, updatedData) => {
        setRequests(requests.map(req =>
            req.id === Number(id) ? { ...req, ...updatedData } : req
        ));
    };

    const updateRequestStatus = (id, status, reason = '') => {
        setRequests(requests.map(req =>
            req.id === id ? { ...req, status, reason } : req
        ));
    };

    const getRequestById = (id) => {
        return requests.find(req => req.id === Number(id));
    };

    // LOGIC: Check available rooms
    const getAvailableRooms = (date, time, duration) => {
        if (!date || !time || !duration) return [];

        const [h, m] = time.split(':').map(Number);
        const startMinutes = h * 60 + m;
        const endMinutes = startMinutes + Number(duration);

        // Find occupied room IDs for this date
        const occupiedRoomIds = requests
            .filter(req => req.status === 'Approved' && req.date === date)
            .filter(req => {
                const [rH, rM] = req.time.split(':').map(Number);
                const rStart = rH * 60 + rM;
                const rEnd = rStart + Number(req.duration);
                return (startMinutes < rEnd) && (endMinutes > rStart);
            })
            .map(req => req.room);

        return AVAILABLE_ROOMS.filter(r => !occupiedRoomIds.includes(r.id));
    };

    return (
        <ExamRequestContext.Provider value={{
            requests,
            addRequest,
            editRequest,
            updateRequestStatus,
            getAvailableRooms,
            getRequestById
        }}>
            {children}
        </ExamRequestContext.Provider>
    );
};

export const useExamRequests = () => {
    return useContext(ExamRequestContext);
};
