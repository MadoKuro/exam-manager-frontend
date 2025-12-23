import { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Grow } from '@mui/material';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog } from '../../../components/admin';

export default function SemestersList() {
    const { semesters, semestersCrud, years } = useAdminData();
    const { notify } = useNotification();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', yearId: '', startDate: '', endDate: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        { key: 'name', label: 'Semester Name' },
        {
            key: 'yearId',
            label: 'Academic Year',
            render: (row) => years.find(y => y.id === row.yearId)?.name || '-'
        },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
    ];

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ name: '', yearId: years[0]?.id || '', startDate: '', endDate: '' });
        setOpenDialog(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ name: item.name, yearId: item.yearId, startDate: item.startDate, endDate: item.endDate });
        setOpenDialog(true);
    };

    const handleDelete = (item) => {
        setDeleteConfirm({ open: true, item });
    };

    const confirmDelete = () => {
        semestersCrud.remove(deleteConfirm.item.id);
        notify('Semester deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    const handleSave = () => {
        if (!formData.name || !formData.yearId || !formData.startDate || !formData.endDate) {
            notify('Please fill all fields', 'error');
            return;
        }

        if (editingItem) {
            semestersCrud.update(editingItem.id, formData);
            notify('Semester updated successfully', 'success');
        } else {
            semestersCrud.add(formData);
            notify('Semester added successfully', 'success');
        }
        setOpenDialog(false);
    };

    return (
        <Box>
            <AdminPageHeader
                title="Semesters Management"
                subtitle="Manage academic semesters"
                onAdd={handleAdd}
                addLabel="Add Semester"
            />

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={semesters}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No semesters found"
                    />
                </Box>
            </Grow>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{ sx: { borderRadius: '16px', minWidth: 400 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {editingItem ? 'Edit Semester' : 'Add Semester'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Semester Name"
                        placeholder="e.g., Fall 2024"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Academic Year"
                        fullWidth
                        value={formData.yearId}
                        onChange={(e) => setFormData({ ...formData, yearId: Number(e.target.value) })}
                        sx={{ mb: 2 }}
                    >
                        {years.map((year) => (
                            <MenuItem key={year.id} value={year.id}>{year.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                title="Delete Semester"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"?`}
            />
        </Box>
    );
}
