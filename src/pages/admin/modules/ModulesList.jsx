import { useState } from 'react';
import { Box, Chip, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog, FileImportButton } from '../../../components/admin';

export default function ModulesList() {
    const { modules, modulesCrud, semesters, teachers, importModules } = useAdminData();
    const { notify } = useNotification();
    const navigate = useNavigate();

    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        { key: 'code', label: 'Code', render: (row) => <Chip label={row.code} size="small" variant="outlined" /> },
        { key: 'name', label: 'Module Name', render: (row) => <strong>{row.name}</strong> },
        {
            key: 'semesterId',
            label: 'Semester',
            render: (row) => semesters.find(s => s.id === row.semesterId)?.name || '-'
        },
        {
            key: 'teacherId',
            label: 'Responsible Teacher',
            render: (row) => teachers.find(t => t.id === row.teacherId)?.name || '-'
        },
    ];

    const handleAdd = () => {
        navigate('/admin/modules/add');
    };

    const handleEdit = (module) => {
        navigate(`/admin/modules/${module.id}/edit`);
    };

    const handleDelete = (module) => {
        setDeleteConfirm({ open: true, item: module });
    };

    const confirmDelete = () => {
        modulesCrud.remove(deleteConfirm.item.id);
        notify('Module deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    const handleImport = (data) => {
        // Map CSV data to proper format
        const processed = data.map(row => ({
            name: row.name,
            code: row.code,
            semesterId: Number(row.semesterid) || semesters[0]?.id || 1,
            teacherId: Number(row.teacherid) || teachers[0]?.id || 1,
        }));

        importModules(processed);
        notify(`Imported ${processed.length} modules successfully`, 'success');
    };

    return (
        <Box>
            <AdminPageHeader
                title="Modules Management"
                subtitle="Manage course modules"
                onAdd={handleAdd}
                addLabel="Add Module"
            >
                <FileImportButton
                    onImport={handleImport}
                    requiredFields={['name', 'code']}
                    label="Import CSV"
                />
            </AdminPageHeader>

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={modules}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No modules found"
                    />
                </Box>
            </Grow>

            <ConfirmDialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={confirmDelete}
                title="Delete Module"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"?`}
            />
        </Box>
    );
}
