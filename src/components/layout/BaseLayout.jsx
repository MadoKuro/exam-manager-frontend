import { Box, Drawer, AppBar, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { LAYOUT, GLASSMORPHISM } from '../../theme/themeConstants';
import SidebarHeader from './SidebarHeader';
import NavigationMenu from './NavigationMenu';
import LogoutButton from './LogoutButton';
import AppBarControls from './AppBarControls';

const drawerWidth = LAYOUT.drawerWidth;

/**
 * Shared base layout with glassmorphic AppBar and Drawer
 * @param {string} role - User role for sidebar badge
 * @param {Array} menuItems - Navigation menu items
 * @param {ReactNode} appBarControls - Custom AppBar controls component
 * @param {ReactNode} sidebarContent - Optional custom sidebar content (before menu)
 * @param {Array} menuSections - Optional grouped menu sections for admin layout
 */
export default function BaseLayout({
    role,
    menuItems = [],
    menuSections,
    appBarControls,
    sidebarContent
}) {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Glass AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    background: theme.palette.mode === 'light'
                        ? GLASSMORPHISM.appBar.light
                        : GLASSMORPHISM.appBar.dark,
                    backdropFilter: GLASSMORPHISM.appBar.blur,
                    boxShadow: 'none',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                }}
            >
                <Toolbar variant="dense" sx={{ minHeight: 56, justifyContent: 'flex-end' }}>
                    {appBarControls}
                </Toolbar>
            </AppBar>

            {/* Floating Glass Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth - 24,
                        margin: '12px',
                        height: 'calc(100vh - 24px)',
                        borderRadius: '16px',
                        boxSizing: 'border-box',
                        border: `1px solid ${theme.palette.mode === 'light'
                            ? GLASSMORPHISM.sidebar.border.light
                            : GLASSMORPHISM.sidebar.border.dark}`,
                        background: theme.palette.mode === 'light'
                            ? GLASSMORPHISM.sidebar.light
                            : GLASSMORPHISM.sidebar.dark,
                        backdropFilter: GLASSMORPHISM.sidebar.blur,
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    },
                }}
            >
                {/* Logo Section */}
                <Box sx={{ width: '100%' }}>
                    <SidebarHeader role={role} />
                </Box>

                {/* Optional custom content before menu */}
                {sidebarContent}

                {/* Navigation Menu */}
                <Box sx={{
                    overflow: 'auto',
                    px: 2,
                    flexGrow: 1,
                    mt: 0.5,
                    '&::-webkit-scrollbar': {
                        width: '0px',
                        display: 'none'
                    },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    {menuSections ? (
                        // Grouped sections for admin
                        menuSections
                    ) : (
                        // Simple menu for student/teacher
                        <NavigationMenu items={menuItems} />
                    )}
                </Box>

                {/* Logout Button */}
                <LogoutButton />
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
                <Toolbar /> {/* Spacer */}
                <Box>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
