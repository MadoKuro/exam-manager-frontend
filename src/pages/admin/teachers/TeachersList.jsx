import { useState } from 'react';
import { Box, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog } from '../../../components/admin';

export default function TeachersList() {
    const { teachers, teachersCrud } = useAdminData();
    const { notify } = useNotification();
    const navigate = useNavigate();

    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        { key: 'name', label: 'Name', render: (row) => <strong>{row.name}</strong> },
        { key: 'email', label: 'Email' },
        { key: 'department', label: 'Department', render: (row) => row.department || '-' },
        { key: 'office', label: 'Office', render: (row) => row.office || '-' },
    ];

    const handleAdd = () => {
        navigate('/admin/teachers/add');
    };

    const handleEdit = (teacher) => {
        navigate(`/admin/teachers/${teacher.id}/edit`);
    };

    const handleDelete = (teacher) => {
        setDeleteConfirm({ open: true, item: teacher });
    };

    const confirmDelete = () => {
        teachersCrud.remove(deleteConfirm.item.id);
        notify('Teacher deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    return (
        <Box>
            <AdminPageHeader
                title="Teachers Management"
                subtitle="Manage teaching staff"
                onAdd={handleAdd}
                addLabel="Add Teacher"
            />

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={teachers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No teachers found"
                    />
                </Box>
            </Grow>

            <ConfirmDialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={confirmDelete}
                title="Delete Teacher"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"? This may affect assigned modules.`}
            />
        </Box>
    );
}
