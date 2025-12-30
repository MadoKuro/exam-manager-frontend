import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
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

// Exams Pages
import ExamsList from '../pages/admin/exams/ExamsList';
import ExamForm from '../pages/admin/exams/ExamForm';
import SurveillantsList from '../pages/admin/surveillants/SurveillantsList';
import PlanningView from '../pages/admin/planning/PlanningView';
import ConvocationsList from '../pages/admin/convocations/ConvocationsList';
import ConvocationDetail from '../pages/admin/convocations/ConvocationDetail';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/Dashboard';
import TeacherProfile from '../pages/teacher/Profile';
import TeacherSchedule from '../pages/teacher/Schedule';
import TeacherRequests from '../pages/teacher/Requests';

// Admin Additional Pages
import AdminRequests from '../pages/admin/Requests';

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
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

            {/* Admin Routes */}
            <Route element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route path="/admin/requests" element={<AdminRequests />} />
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
                {/* Exams Routes */}
                <Route path="/admin/exams" element={<ExamsList />} />
                <Route path="/admin/exams/add" element={<ExamForm />} />
                <Route path="/admin/exams/:id/edit" element={<ExamForm />} />
                <Route path="/admin/surveillants" element={<SurveillantsList />} />
                <Route path="/admin/planning" element={<PlanningView />} />
                <Route path="/admin/convocations" element={<ConvocationsList />} />
                <Route path="/admin/convocations/:id" element={<ConvocationDetail />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherLayout />
                </ProtectedRoute>
            }>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/profile" element={<TeacherProfile />} />
                <Route path="/teacher/schedule" element={<TeacherSchedule />} />
                <Route path="/teacher/requests" element={<TeacherRequests />} />
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
                    user.role === 'admin' ? <Navigate to="/admin/requests" /> :
                        user.role === 'teacher' ? <Navigate to="/teacher/dashboard" /> :
                            <Navigate to="/student/dashboard" />
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
}
