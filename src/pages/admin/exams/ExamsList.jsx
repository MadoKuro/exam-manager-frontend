import { useState } from 'react';
import { Box, Chip, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog, StatusChip } from '../../../components/admin';
import {
    getModuleName,
    getModuleCode,
    getRoomNames,
    getSurveillantCount,
    formatDuration
} from '../../../utils/examHelpers';

/**
 * Exams listing page with DataTable
 */
export default function ExamsList() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { exams, examsCrud, modules, rooms, groups, teachers } = useAdminData();
    const { notify } = useNotification();

    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        {
            key: 'module',
            label: 'Module',
            render: (row) => (
                <Box>
                    <Chip
                        label={getModuleCode(row.moduleId, modules)}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                    />
                    <strong>{getModuleName(row.moduleId, modules)}</strong>
                </Box>
            )
        },
        {
            key: 'date',
            label: 'Date & Time',
            render: (row) => (
                <Box>
                    <Box sx={{ fontWeight: 600 }}>{row.date}</Box>
                    <Box sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
                        {row.startTime} ({formatDuration(row.duration)})
                    </Box>
                </Box>
            )
        },
        {
            key: 'type',
            label: 'Type',
            render: (row) => {
                const isWritten = row.type === 'Written';
                const isOral = row.type === 'Oral';
                const isPractical = row.type === 'Practical';

                const variant = isWritten ? 'primary'
                    : isOral ? 'secondary'
                        : isPractical ? 'info'
                            : 'warning';

                return <StatusChip label={row.type} variant={variant} />;
            }
        },
        {
            key: 'rooms',
            label: 'Rooms',
            render: (row) => getRoomNames(row.roomIds, rooms)
        },
        {
            key: 'surveillants',
            label: 'Surveillants',
            render: (row) => (
                <StatusChip
                    label={`${getSurveillantCount(row.surveillantIds)} assigned`}
                    variant={getSurveillantCount(row.surveillantIds) > 0 ? 'success' : 'warning'}
                />
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => {
                const isCompleted = row.status === 'Completed';
                const isCancelled = row.status === 'Cancelled';

                const variant = isCompleted ? 'success'
                    : isCancelled ? 'error'
                        : 'info';

                return <StatusChip label={row.status || 'Scheduled'} variant={variant} />;
            }
        }
    ];

    const handleAdd = () => {
        navigate('/admin/exams/add');
    };

    const handleEdit = (exam) => {
        navigate(`/admin/exams/${exam.id}/edit`);
    };

    const handleDelete = (exam) => {
        setDeleteConfirm({ open: true, item: exam });
    };

    const confirmDelete = () => {
        examsCrud.remove(deleteConfirm.item.id);
        notify('Exam deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    return (
        <Box>
            <AdminPageHeader
                title="Exams Management"
                subtitle="Create and manage exams"
                onAdd={handleAdd}
                addLabel="Create Exam"
            />

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={exams}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No exams found. Create your first exam!"
                    />
                </Box>
            </Grow>

            <ConfirmDialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={confirmDelete}
                title="Delete Exam"
                message={`Are you sure you want to delete the exam for "${deleteConfirm.item ? getModuleName(deleteConfirm.item.moduleId, modules) : ''}"?`}
            />
        </Box>
    );
}
