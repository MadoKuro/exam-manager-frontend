import { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grow } from '@mui/material';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog } from '../../../components/admin';

export default function LevelsList() {
    const { levels, levelsCrud } = useAdminData();
    const { notify } = useNotification();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Level Name' },
    ];

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ name: '', code: '' });
        setOpenDialog(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ name: item.name, code: item.code });
        setOpenDialog(true);
    };

    const handleDelete = (item) => {
        setDeleteConfirm({ open: true, item });
    };

    const confirmDelete = () => {
        levelsCrud.remove(deleteConfirm.item.id);
        notify('Level deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    const handleSave = () => {
        if (!formData.name || !formData.code) {
            notify('Please fill all fields', 'error');
            return;
        }

        if (editingItem) {
            levelsCrud.update(editingItem.id, formData);
            notify('Level updated successfully', 'success');
        } else {
            levelsCrud.add(formData);
            notify('Level added successfully', 'success');
        }
        setOpenDialog(false);
    };

    return (
        <Box>
            <AdminPageHeader
                title="Levels Management"
                subtitle="Manage study levels and programs"
                onAdd={handleAdd}
                addLabel="Add Level"
            />

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={levels}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No levels found"
                    />
                </Box>
            </Grow>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{ sx: { borderRadius: '16px', minWidth: 400 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {editingItem ? 'Edit Level' : 'Add Level'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Code"
                        placeholder="e.g., L1, M2"
                        fullWidth
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Level Name"
                        placeholder="e.g., License 1"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                title="Delete Level"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"?`}
            />
        </Box>
    );
}
