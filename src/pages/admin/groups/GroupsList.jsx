import { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Grow } from '@mui/material';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog } from '../../../components/admin';

export default function GroupsList() {
    const { groups, groupsCrud, levels } = useAdminData();
    const { notify } = useNotification();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', levelId: '', capacity: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        { key: 'name', label: 'Group Name' },
        {
            key: 'levelId',
            label: 'Level',
            render: (row) => levels.find(l => l.id === row.levelId)?.name || '-'
        },
        { key: 'capacity', label: 'Capacity' },
    ];

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ name: '', levelId: levels[0]?.id || '', capacity: '' });
        setOpenDialog(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ name: item.name, levelId: item.levelId, capacity: item.capacity });
        setOpenDialog(true);
    };

    const handleDelete = (item) => {
        setDeleteConfirm({ open: true, item });
    };

    const confirmDelete = () => {
        groupsCrud.remove(deleteConfirm.item.id);
        notify('Group deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    const handleSave = () => {
        if (!formData.name || !formData.levelId || !formData.capacity) {
            notify('Please fill all fields', 'error');
            return;
        }

        const dataToSave = { ...formData, capacity: Number(formData.capacity) };

        if (editingItem) {
            groupsCrud.update(editingItem.id, dataToSave);
            notify('Group updated successfully', 'success');
        } else {
            groupsCrud.add(dataToSave);
            notify('Group added successfully', 'success');
        }
        setOpenDialog(false);
    };

    return (
        <Box>
            <AdminPageHeader
                title="Groups Management"
                subtitle="Manage student groups"
                onAdd={handleAdd}
                addLabel="Add Group"
            />

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={groups}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No groups found"
                    />
                </Box>
            </Grow>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{ sx: { borderRadius: '16px', minWidth: 400 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {editingItem ? 'Edit Group' : 'Add Group'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Group Name"
                        placeholder="e.g., Group A"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Level"
                        fullWidth
                        value={formData.levelId}
                        onChange={(e) => setFormData({ ...formData, levelId: Number(e.target.value) })}
                        sx={{ mb: 2 }}
                    >
                        {levels.map((level) => (
                            <MenuItem key={level.id} value={level.id}>{level.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Capacity"
                        type="number"
                        fullWidth
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2 }}>
                        {editingItem ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={confirmDelete}
                title="Delete Group"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"?`}
            />
        </Box>
    );
}
