import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import StudentLayout from '../layouts/StudentLayout';

// Auth Pages
import Login from '../pages/auth/Login';

// Admin Pages
import YearsList from '../pages/admin/years/YearsList';
import SemestersList from '../pages/admin/semesters/SemestersList';
import LevelsList from '../pages/admin/levels/LevelsList';
import GroupsList from '../pages/admin/groups/GroupsList';
import TeachersList from '../pages/admin/teachers/TeachersList';
import TeacherForm from '../pages/admin/teachers/TeacherForm';
import StudentsList from '../pages/admin/students/StudentsList';
import StudentForm from '../pages/admin/students/StudentForm';
import ModulesList from '../pages/admin/modules/ModulesList';
import ModuleForm from '../pages/admin/modules/ModuleForm';
import RoomsList from '../pages/admin/rooms/RoomsList';
import RoomForm from '../pages/admin/rooms/RoomForm';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/Dashboard';

// Student Pages
// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentSchedule from '../pages/student/Schedule';
import StudentNotifications from '../pages/student/Notifications';
import StudentModules from '../pages/student/Modules';
import StudentDownloads from '../pages/student/Downloads';
import StudentProfile from '../pages/student/Profile';

export default function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            </Route>

            {/* Admin Routes */}
            <Route element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route path="/admin/years" element={<YearsList />} />
                <Route path="/admin/semesters" element={<SemestersList />} />
                <Route path="/admin/levels" element={<LevelsList />} />
                <Route path="/admin/groups" element={<GroupsList />} />
                <Route path="/admin/teachers" element={<TeachersList />} />
                <Route path="/admin/teachers/add" element={<TeacherForm />} />
                <Route path="/admin/teachers/:id/edit" element={<TeacherForm />} />
                <Route path="/admin/students" element={<StudentsList />} />
                <Route path="/admin/students/add" element={<StudentForm />} />
                <Route path="/admin/students/:id/edit" element={<StudentForm />} />
                <Route path="/admin/modules" element={<ModulesList />} />
                <Route path="/admin/modules/add" element={<ModuleForm />} />
                <Route path="/admin/modules/:id/edit" element={<ModuleForm />} />
                <Route path="/admin/rooms" element={<RoomsList />} />
                <Route path="/admin/rooms/add" element={<RoomForm />} />
                <Route path="/admin/rooms/:id/edit" element={<RoomForm />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherLayout />
                </ProtectedRoute>
            }>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            </Route>

            {/* Student Routes */}
            <Route element={
                <ProtectedRoute allowedRoles={['student']}>
                    <StudentLayout />
                </ProtectedRoute>
            }>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/schedule" element={<StudentSchedule />} />
                <Route path="/student/notifications" element={<StudentNotifications />} />
                <Route path="/student/modules" element={<StudentModules />} />
                <Route path="/student/downloads" element={<StudentDownloads />} />
                <Route path="/student/profile" element={<StudentProfile />} />
            </Route>

            {/* Root/Redirect Logic */}
            <Route path="/" element={
                !user ? <Navigate to="/login" /> :
                    user.role === 'admin' ? <Navigate to="/admin/years" /> :
                        user.role === 'teacher' ? <Navigate to="/teacher/dashboard" /> :
                            <Navigate to="/student/dashboard" />
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
}
