import { createContext, useContext, useState } from 'react';
<<<<<<< HEAD
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const notify = (msg, type = 'success') => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
=======
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info' // 'success' | 'error' | 'warning' | 'info'
    });

    const notify = (message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(prev => ({ ...prev, open: false }));
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <Snackbar
<<<<<<< HEAD
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '16px',
                        fontWeight: 600,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        // Premium Colors
                        ...(severity === 'success' && {
                            bgcolor: '#10b981', // Emerald
                            color: 'white',
                            '& .MuiAlert-icon': { color: 'white' }
                        }),
                        ...(severity === 'error' && {
                            bgcolor: '#ef4444', // Red
                            color: 'white',
                            '& .MuiAlert-icon': { color: 'white' }
                        }),
                        ...(severity === 'info' && {
                            bgcolor: '#3b82f6', // Blue
                            color: 'white',
                            '& .MuiAlert-icon': { color: 'white' }
                        }),
                    }}
                >
                    {message}
=======
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={notification.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    {notification.message}
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};
<<<<<<< HEAD

export const useNotification = () => useContext(NotificationContext);
=======
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
