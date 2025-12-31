import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { name, role: 'admin' | 'teacher' | 'student' }
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                    const userData = { id: 1, name: 'Admin User', role: 'admin', email };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                } else if (email === 'teacher@teacher.com') {
                    // ID 1 matches the first teacher in initialTeachers mock data
                    const userData = { id: 1, name: 'Teacher User', role: 'teacher', email };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    resolve(userData);
                } else if (email === 'student@student.com') {
                    // ID 1 matches the first student in initialStudents mock data
                    const userData = { id: 1, name: 'Student User', role: 'student', email };
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
