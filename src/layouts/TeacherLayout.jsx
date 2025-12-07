import { Outlet, Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAuth } from '../context/AuthContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Placeholder icon
import ClassIcon from '@mui/icons-material/Class';     // Placeholder icon
import EventIcon from '@mui/icons-material/Event';    // Placeholder icon
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../context/ThemeContext';

const drawerWidth = 260;

export default function TeacherLayout() {
    const { logout } = useAuth();
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const location = useLocation();

    // Placeholder menu items for Teacher
    const menuItems = [
        { text: 'Dashboard', path: '/teacher/dashboard', icon: <DashboardIcon /> },
        { text: 'My Classes', path: '/teacher/classes', icon: <ClassIcon /> },
        { text: 'Schedule', path: '/teacher/schedule', icon: <EventIcon /> },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Invisible/Transparent AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    background: 'transparent',
                    boxShadow: 'none',
                    backdropFilter: 'none',
                    color: theme.palette.text.primary
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Teacher Dashboard
                    </Typography>
                    <IconButton onClick={toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Sidebar (Drawer) */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: 'none',
                        background: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)',
                        backdropFilter: 'blur(16px)',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        UniManager
                    </Typography>
                </Toolbar>

                <Box sx={{ overflow: 'auto', mt: 2, px: 2, flexGrow: 1 }}>
                    <List>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            borderRadius: '12px',
                                            background: isActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                                            color: isActive ? 'white' : 'inherit',
                                            '&:hover': {
                                                background: isActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(16, 185, 129, 0.08)',
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit', minWidth: 40 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

                {/* Bottom Section: User & Logout */}
                <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout} sx={{ borderRadius: '12px', color: theme.palette.error.main }}>
                            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Spacer for AppBar */}
                <Outlet />
            </Box>
        </Box>
    );
}
