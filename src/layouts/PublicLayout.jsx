import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../context/ThemeContext';

export default function PublicLayout() {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Outlet />
    </Box>
  );
}
