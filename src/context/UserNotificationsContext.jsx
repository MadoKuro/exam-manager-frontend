import { createContext, useContext, useState, useCallback } from 'react';

const UserNotificationsContext = createContext();

export const useUserNotifications = () => {
    const context = useContext(UserNotificationsContext);
    if (!context) {
        throw new Error('useUserNotifications must be used within UserNotificationsProvider');
    }
    return context;
};

// Notification types for role-based filtering
export const NOTIFICATION_TYPES = {
    REQUEST_APPROVED: 'REQUEST_APPROVED',
    REQUEST_REFUSED: 'REQUEST_REFUSED',
    ROOM_CHANGE: 'ROOM_CHANGE',
    SCHEDULE_UPDATE: 'SCHEDULE_UPDATE',
    NEW_EXAM: 'NEW_EXAM',
    ANNOUNCEMENT: 'ANNOUNCEMENT'
};

export const UserNotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        // Initial mock data for students
        {
            id: 1,
            type: NOTIFICATION_TYPES.ROOM_CHANGE,
            title: 'Room Change',
            message: 'Algorithmics 2 exam moved to Room 23',
            date: new Date().toISOString(),
            read: false,
            targetRoles: ['student']
        },
        {
            id: 2,
            type: NOTIFICATION_TYPES.NEW_EXAM,
            title: 'New Exam Added',
            message: 'Database Systems Final Exam schedule released',
            date: new Date(Date.now() - 86400000).toISOString(),
            read: false,
            targetRoles: ['student']
        },
        {
            id: 3,
            type: NOTIFICATION_TYPES.SCHEDULE_UPDATE,
            title: 'Schedule Update',
            message: 'Mathematics mid-term time changed to 14:00',
            date: new Date(Date.now() - 172800000).toISOString(),
            read: true,
            targetRoles: ['student']
        },
        {
            id: 4,
            type: NOTIFICATION_TYPES.ANNOUNCEMENT,
            title: 'Announcement',
            message: 'End of semester exam period begins January 12th',
            date: new Date(Date.now() - 259200000).toISOString(),
            read: true,
            targetRoles: ['student', 'teacher']
        }
    ]);

    const addNotification = useCallback((notification) => {
        setNotifications(prev => [{
            id: Date.now(),
            date: new Date().toISOString(),
            read: false,
            ...notification
        }, ...prev]);
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllAsRead = useCallback((role) => {
        setNotifications(prev =>
            prev.map(n => n.targetRoles?.includes(role) ? { ...n, read: true } : n)
        );
    }, []);

    // Get notifications for a specific role, optionally filtered by userId
    const getNotificationsForRole = useCallback((role, userId = null) => {
        return notifications.filter(n => {
            const roleMatch = n.targetRoles?.includes(role);
            // If targetUserId is specified, also filter by user
            if (n.targetUserId && userId) {
                return roleMatch && n.targetUserId === userId;
            }
            // If no targetUserId on notification, show to all users with that role
            return roleMatch && !n.targetUserId;
        });
    }, [notifications]);

    // Get notifications specifically for a user (by ID and role)
    const getNotificationsForUser = useCallback((role, userId) => {
        return notifications.filter(n => {
            const roleMatch = n.targetRoles?.includes(role);
            // Show if: no targetUserId (broadcast to role) OR targetUserId matches
            return roleMatch && (!n.targetUserId || n.targetUserId === userId);
        });
    }, [notifications]);

    const getUnreadCount = useCallback((role, userId = null) => {
        return notifications.filter(n => {
            const roleMatch = n.targetRoles?.includes(role);
            const isUnread = !n.read;
            // Show if: no targetUserId (broadcast to role) OR targetUserId matches
            const userMatch = !n.targetUserId || n.targetUserId === userId;
            return roleMatch && isUnread && userMatch;
        }).length;
    }, [notifications]);

    return (
        <UserNotificationsContext.Provider value={{
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            getNotificationsForRole,
            getNotificationsForUser,
            getUnreadCount,
            NOTIFICATION_TYPES
        }}>
            {children}
        </UserNotificationsContext.Provider>
    );
};
