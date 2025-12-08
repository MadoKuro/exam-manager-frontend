import { createContext, useContext, useState } from 'react';
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
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <Snackbar
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
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
