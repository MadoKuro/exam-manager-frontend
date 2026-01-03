import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services';
import { useAuth } from './AuthContext';

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
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch notifications when user changes
    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setNotifications([]);
            setLoading(false);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await notificationService.getAll();
            setNotifications(response.data.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const addNotification = useCallback(async (notification) => {
        // For admin-created notifications, call API
        // For local/optimistic notifications, add to state directly
        try {
            if (notification.persist !== false) {
                const response = await notificationService.create({
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    target_roles: notification.targetRoles,
                    target_user_id: notification.targetUserId,
                });
                const created = response.data.data;
                setNotifications(prev => [created, ...prev]);
                return created;
            } else {
                // Local-only notification (not persisted)
                const localNotification = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    read: false,
                    ...notification
                };
                setNotifications(prev => [localNotification, ...prev]);
                return localNotification;
            }
        } catch (err) {
            console.error('Error creating notification:', err);
            throw err;
        }
    }, []);

    const markAsRead = useCallback(async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
            throw err;
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            throw err;
        }
    }, []);

    // Get notifications for a specific role (client-side filtering for compatibility)
    const getNotificationsForRole = useCallback((role, userId = null) => {
        return notifications.filter(n => {
            const roleMatch = n.targetRoles?.includes(role);
            if (n.targetUserId && userId) {
                return roleMatch && n.targetUserId === userId;
            }
            return roleMatch && !n.targetUserId;
        });
    }, [notifications]);

    // Get notifications for a specific user (by ID and role)
    const getNotificationsForUser = useCallback((role, userId) => {
        return notifications.filter(n => {
            const roleMatch = n.targetRoles?.includes(role);
            return roleMatch && (!n.targetUserId || n.targetUserId === userId);
        });
    }, [notifications]);

    const getUnreadCount = useCallback((role, userId = null) => {
        return notifications.filter(n => {
            const roleMatch = n.targetRoles?.includes(role);
            const isUnread = !n.read;
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
            loading,
            error,
            refetch: fetchNotifications,
            NOTIFICATION_TYPES
        }}>
            {children}
        </UserNotificationsContext.Provider>
    );
};
