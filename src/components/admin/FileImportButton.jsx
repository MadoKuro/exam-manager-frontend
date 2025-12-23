import { useRef } from 'react';
import { Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

/**
 * File import button for CSV files
 * @param {Function} onImport - Receives parsed array of objects
 * @param {Array} requiredFields - Field names required in CSV
 */
export default function FileImportButton({
    onImport,
    requiredFields = [],
    label = 'Import CSV'
}) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const parseCSV = (text) => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        return data;
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                const parsed = parseCSV(text);

                // Validate required fields
                if (requiredFields.length > 0 && parsed.length > 0) {
                    const missingFields = requiredFields.filter(
                        field => !Object.keys(parsed[0]).includes(field.toLowerCase())
                    );
                    if (missingFields.length > 0) {
                        alert(`Missing required columns: ${missingFields.join(', ')}`);
                        return;
                    }
                }

                onImport(parsed);
            }
        };
        reader.readAsText(file);

        // Reset input
        event.target.value = '';
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={handleClick}
                sx={{ borderRadius: 2 }}
            >
                {label}
            </Button>
        </>
    );
}
