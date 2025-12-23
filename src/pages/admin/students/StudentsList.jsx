import { useState } from 'react';
import { Box, Chip, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog } from '../../../components/admin';

export default function StudentsList() {
    const { students, studentsCrud, levels, groups } = useAdminData();
    const { notify } = useNotification();
    const navigate = useNavigate();

    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        { key: 'name', label: 'Name', render: (row) => <strong>{row.name}</strong> },
        { key: 'email', label: 'Email' },
        {
            key: 'levelId',
            label: 'Level',
            render: (row) => {
                const level = levels.find(l => l.id === row.levelId);
                return level ? <Chip label={level.code} size="small" variant="outlined" /> : '-';
            }
        },
        { key: 'specialization', label: 'Specialization' },
        {
            key: 'groupId',
            label: 'Group',
            render: (row) => groups.find(g => g.id === row.groupId)?.name || '-'
        },
    ];

    const handleAdd = () => {
        navigate('/admin/students/add');
    };

    const handleEdit = (student) => {
        navigate(`/admin/students/${student.id}/edit`);
    };

    const handleDelete = (student) => {
        setDeleteConfirm({ open: true, item: student });
    };

    const confirmDelete = () => {
        studentsCrud.remove(deleteConfirm.item.id);
        notify('Student deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    return (
        <Box>
            <AdminPageHeader
                title="Students Management"
                subtitle="Manage student records"
                onAdd={handleAdd}
                addLabel="Add Student"
            />

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={students}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No students found"
                    />
                </Box>
            </Grow>

            <ConfirmDialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={confirmDelete}
                title="Delete Student"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"?`}
            />
        </Box>
    );
}
