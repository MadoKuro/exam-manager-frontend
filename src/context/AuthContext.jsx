import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { name, role: 'admin' | 'teacher' | 'student' }
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Simulate checking auth state (e.g., from localStorage)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login logic - replace with API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@admin.com') {
                    const userData = { name: 'Admin User', role: 'admin' };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                } else if (email === 'teacher@teacher.com') {
                    const userData = { name: 'Teacher User', role: 'teacher' };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                } else if (email === 'student@student.com') {
                    const userData = { name: 'Student User', role: 'student' };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    };

    const logout = () => {
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
