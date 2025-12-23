import { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grow } from '@mui/material';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader, DataTable, ConfirmDialog } from '../../../components/admin';

export default function YearsList() {
    const { years, yearsCrud } = useAdminData();
    const { notify } = useNotification();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingYear, setEditingYear] = useState(null);
    const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

    const columns = [
        { key: 'name', label: 'Year Name' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
    ];

    const handleAdd = () => {
        setEditingYear(null);
        setFormData({ name: '', startDate: '', endDate: '' });
        setOpenDialog(true);
    };

    const handleEdit = (year) => {
        setEditingYear(year);
        setFormData({ name: year.name, startDate: year.startDate, endDate: year.endDate });
        setOpenDialog(true);
    };

    const handleDelete = (year) => {
        setDeleteConfirm({ open: true, item: year });
    };

    const confirmDelete = () => {
        yearsCrud.remove(deleteConfirm.item.id);
        notify('Year deleted successfully', 'success');
        setDeleteConfirm({ open: false, item: null });
    };

    const handleSave = () => {
        if (!formData.name || !formData.startDate || !formData.endDate) {
            notify('Please fill all fields', 'error');
            return;
        }

        if (editingYear) {
            yearsCrud.update(editingYear.id, formData);
            notify('Year updated successfully', 'success');
        } else {
            yearsCrud.add(formData);
            notify('Year added successfully', 'success');
        }
        setOpenDialog(false);
    };

    return (
        <Box>
            <AdminPageHeader
                title="Years Management"
                subtitle="Manage academic years"
                onAdd={handleAdd}
                addLabel="Add Year"
            />

            <Grow in={true}>
                <Box>
                    <DataTable
                        columns={columns}
                        data={years}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        emptyMessage="No academic years found"
                    />
                </Box>
            </Grow>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{ sx: { borderRadius: '16px', minWidth: 400 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {editingYear ? 'Edit Year' : 'Add Year'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Year Name"
                        placeholder="e.g., 2024-2025"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        sx={{ mb: 2 }}
                    />
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
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2 }}>
                        {editingYear ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={confirmDelete}
                title="Delete Year"
                message={`Are you sure you want to delete "${deleteConfirm.item?.name}"? This action cannot be undone.`}
            />
        </Box>
    );
}
