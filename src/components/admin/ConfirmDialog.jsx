import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { COLORS } from '../../theme/themeConstants';

/**
 * Reusable confirmation dialog for delete actions
 */
export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'Confirm Delete',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel'
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: '16px', minWidth: 400 } }}
        >
            <DialogTitle sx={{ color: COLORS.errorMain, fontWeight: 'bold' }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
                    {cancelLabel}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 2 }}
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
