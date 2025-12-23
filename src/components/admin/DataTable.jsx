import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { GLASSMORPHISM, COLORS } from '../../theme/themeConstants';

/**
 * Reusable data table with edit/delete actions
 * @param {Array} columns - Column definitions: { key, label, render? }
 * @param {Array} data - Array of row objects
 * @param {Function} onEdit - Edit handler (receives row)
 * @param {Function} onDelete - Delete handler (receives row)
 */
export default function DataTable({
    columns,
    data,
    onEdit,
    onDelete,
    emptyMessage = 'No data found'
}) {
    const theme = useTheme();

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: '24px',
                background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                backdropFilter: GLASSMORPHISM.card.blur,
                border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
        >
            <Table>
                <TableHead sx={{ bgcolor: `${COLORS.primaryMain}0D` }}>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={col.key}
                                sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                        {(onEdit || onDelete) && (
                            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary, width: 120 }}>
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <TableRow key={row.id || index} hover>
                                {columns.map((col) => (
                                    <TableCell key={col.key}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </TableCell>
                                ))}
                                {(onEdit || onDelete) && (
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {onEdit && (
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(row)}
                                                        sx={{
                                                            color: COLORS.primaryMain,
                                                            '&:hover': { bgcolor: `${COLORS.primaryMain}15` }
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {onDelete && (
                                                <Tooltip title="Delete" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onDelete(row)}
                                                        sx={{
                                                            color: COLORS.errorMain,
                                                            '&:hover': { bgcolor: COLORS.errorLight }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                align="center"
                                sx={{ py: 6, color: theme.palette.text.secondary }}
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
