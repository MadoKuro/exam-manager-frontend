import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, name, role, email, teacher_id?, student_id? }
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user has active session
        const validateSession = async () => {
            // First check localStorage for cached user
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    // Validate session with backend
                    const response = await authService.getCurrentUser();
                    const userData = response.data.data;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (error) {
                    // Session expired or invalid, clear stored user
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        validateSession();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const userData = response.data.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            // Extract error message from response
            const message = error.response?.data?.message || 'Invalid credentials';
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Ignore logout errors, proceed with client-side cleanup
            console.error('Logout error:', error);
        }
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
