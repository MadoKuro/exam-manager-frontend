import { createContext, useContext, useState } from 'react';

const ExamRequestContext = createContext();

export const useExamRequests = () => {
    const context = useContext(ExamRequestContext);
    if (!context) {
        throw new Error('useExamRequests must be used within ExamRequestProvider');
    }
    return context;
};

export const ExamRequestProvider = ({ children }) => {
    const [requests, setRequests] = useState([
        {
            id: 1,
            module: 'CS101 - Intro to Computer Science',
            date: '2025-12-15',
            time: '09:00',
            duration: 120,
            room: 'A101',
            status: 'Pending',
            teacherId: 1,
            teacherName: 'John Doe'
        },
        {
            id: 2,
            module: 'DB201 - Database Systems',
            date: '2025-12-18',
            time: '14:00',
            duration: 90,
            room: 'B205',
            status: 'Approved',
            teacherId: 1,
            teacherName: 'John Doe'
        },
        {
            id: 3,
            module: 'ALG102 - Algorithms & Data Structures',
            date: '2025-12-20',
            time: '10:30',
            duration: 150,
            room: 'C103',
            status: 'Pending',
            teacherId: 2,
            teacherName: 'Jane Smith'
        },
        {
            id: 4,
            module: 'WEB301 - Web Development',
            date: '2025-12-22',
            time: '13:00',
            duration: 120,
            room: 'A202',
            status: 'Approved',
            teacherId: 1,
            teacherName: 'John Doe'
        }
    ]);

    const addRequest = (newRequest) => {
        const request = {
            ...newRequest,
            id: requests.length + 1,
            status: 'Pending'
        };
        setRequests([...requests, request]);
        return request;
    };

    const updateRequestStatus = (id, status, reason = null) => {
        setRequests(requests.map(req =>
            req.id === id
                ? { ...req, status, refusalReason: reason }
                : req
        ));
    };

    const value = {
        requests,
        addRequest,
        updateRequestStatus
    };

    return (
        <ExamRequestContext.Provider value={value}>
            {children}
        </ExamRequestContext.Provider>
    );
};
