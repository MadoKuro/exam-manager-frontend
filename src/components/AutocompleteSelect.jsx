import { Autocomplete, TextField, Chip, Box, CircularProgress, Typography } from '@mui/material';
import { COLORS } from '../theme/themeConstants';

/**
 * Reusable Autocomplete Select component with search functionality
 * Supports single and multi-select modes with consistent styling
 * 
 * @param {Object} props
 * @param {Array} props.options - Array of option objects
 * @param {*} props.value - Selected value(s)
 * @param {Function} props.onChange - Callback when selection changes
 * @param {string} props.label - Field label
 * @param {boolean} props.multiple - Enable multi-select mode
 * @param {boolean} props.required - Mark field as required
 * @param {boolean} props.loading - Show loading indicator
 * @param {Function} props.getOptionLabel - Function to get display label from option
 * @param {Function} props.renderOptionContent - Custom render function for dropdown options
 * @param {Function} props.isOptionEqualToValue - Function to compare options for equality
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disable the field
 * @param {string} props.helperText - Helper text below field
 * @param {boolean} props.error - Show error state
 * @param {string} props.chipColor - Color for selected chips in multi-select (primary/secondary)
 */
export default function AutocompleteSelect({
    options = [],
    value,
    onChange,
    label,
    multiple = false,
    required = false,
    loading = false,
    getOptionLabel = (option) => option?.name || option?.label || '',
    renderOptionContent,
    isOptionEqualToValue = (option, value) => option?.id === value?.id,
    placeholder,
    disabled = false,
    helperText,
    error = false,
    chipColor = 'primary',
    freeSolo = false,
    ...rest
}) {

    // Handle getOptionLabel for freeSolo mode (can receive strings)
    const safeGetOptionLabel = (option) => {
        if (typeof option === 'string') return option;
        return getOptionLabel(option);
    };

    // Get chip styling based on color prop
    const getChipStyles = () => {
        const colorMap = {
            primary: { bg: `${COLORS.primaryMain}20`, text: COLORS.primaryDark },
            secondary: { bg: `${COLORS.secondaryMain}20`, text: COLORS.secondaryDark },
            info: { bg: `${COLORS.infoMain}20`, text: COLORS.infoDark },
        };
        const colors = colorMap[chipColor] || colorMap.primary;
        return { bgcolor: colors.bg, color: colors.text };
    };

    // Default option renderer showing primary and secondary text
    const defaultRenderOption = (props, option) => {
        const { key, ...otherProps } = props;
        if (renderOptionContent) {
            return (
                <Box component="li" key={key} {...otherProps}>
                    {renderOptionContent(option)}
                </Box>
            );
        }
        return (
            <Box component="li" key={key} {...otherProps}>
                <Box>
                    <Typography variant="body1">
                        {getOptionLabel(option)}
                    </Typography>
                    {option.secondary && (
                        <Typography variant="caption" color="text.secondary">
                            {option.secondary}
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    };

    // Render selected chips for multi-select
    const renderTags = (selected, getTagProps) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                    <Chip
                        key={key}
                        label={getOptionLabel(option)}
                        size="small"
                        sx={getChipStyles()}
                        {...tagProps}
                    />
                );
            })}
        </Box>
    );

    return (
        <Autocomplete
            multiple={multiple}
            freeSolo={freeSolo}
            options={options}
            value={value}
            onChange={(event, newValue) => onChange(newValue)}
            getOptionLabel={safeGetOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            loading={loading}
            disabled={disabled}
            disableCloseOnSelect={multiple}
            renderOption={defaultRenderOption}
            renderTags={multiple ? renderTags : undefined}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={required ? `${label} *` : label}
                    placeholder={placeholder}
                    error={error}
                    helperText={helperText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            sx={{
                '& .MuiAutocomplete-listbox': {
                    maxHeight: 300,
                },
                '& .MuiAutocomplete-option': {
                    py: 1.5,
                },
            }}
            {...rest}
        />
    );
}
