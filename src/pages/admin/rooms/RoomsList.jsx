import { useState } from 'react';
import { Box, Chip, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog, FileImportButton } from '../../../components/admin';
import { COLORS } from '../../../theme/themeConstants';

export default function RoomsList() {
    const { rooms, roomsCrud, importRooms } = useAdminData();
    const { notify } = useNotification();
    const navigate = useNavigate();

    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        { key: 'name', label: 'Room Name', render: (row) => <strong>{row.name}</strong> },
        {
            key: 'capacity',
            label: 'Capacity',
            render: (row) => (
                <Chip
                    label={`${row.capacity} seats`}
                    size="small"
                    sx={{
                        bgcolor: row.capacity >= 100 ? `${COLORS.secondaryMain}20` : `${COLORS.primaryMain}20`,
                        color: row.capacity >= 100 ? COLORS.secondaryMain : COLORS.primaryMain,
                        fontWeight: 600
                    }}
                />
            )
        },
        { key: 'location', label: 'Location' },
    ];

    const handleAdd = () => {
        navigate('/admin/rooms/add');
    };

    const handleEdit = (room) => {
        navigate(`/admin/rooms/${room.id}/edit`);
    };

    const handleDelete = (room) => {
        setDeleteConfirm({ open: true, item: room });
    };

    const confirmDelete = () => {
        roomsCrud.remove(deleteConfirm.item.id);
        notify('Room deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    const handleImport = (data) => {
        // Map CSV data to proper format
        const processed = data.map(row => ({
            name: row.name,
            capacity: Number(row.capacity) || 30,
            location: row.location || '',
        }));

        importRooms(processed);
        notify(`Imported ${processed.length} rooms successfully`, 'success');
    };

    return (
        <Box>
            <AdminPageHeader
                title="Rooms Management"
                subtitle="Manage exam and class rooms"
                onAdd={handleAdd}
                addLabel="Add Room"
            >
                <FileImportButton
                    onImport={handleImport}
                    requiredFields={['name', 'capacity']}
                    label="Import CSV"
                />
            </AdminPageHeader>

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={rooms}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No rooms found"
                    />
                </Box>
            </Grow>

            <ConfirmDialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={confirmDelete}
                title="Delete Room"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"?`}
            />
        </Box>
    );
}
