import { useState } from 'react';
import { Card, CardContent, Button, TextField, Typography, Box, Stack, IconButton, Tooltip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../../context/ThemeContext';
import GradientText from '../../components/GradientText';
import { GRADIENTS, SHADOWS, COLORS } from '../../theme/themeConstants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      position: 'relative',
    }}>
      {/* Theme Toggle */}
      <Tooltip title={theme.palette.mode === 'dark' ? 'Light mode' : 'Dark mode'} arrow>
        <IconButton
          onClick={toggleColorMode}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: COLORS.primaryMain,
            '&:hover': { bgcolor: `${COLORS.primaryMain}15` },
          }}
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>
      <Card sx={{
        minWidth: 480,
        borderRadius: 2,
        boxShadow: theme.palette.mode === 'light'
          ? '0 10px 40px -10px rgba(0,0,0,0.08)'
          : '0 10px 40px -10px rgba(0,0,0,0.4)',
        // Solid background, no glassmorphism
        background: theme.palette.background.paper,
        // Subtle border
        border: `1px solid ${theme.palette.divider}`
      }}>
        <CardContent sx={{ p: 6 }}>
          <Stack alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{
              p: 2,
              borderRadius: '24px',
              background: GRADIENTS.brand,
              boxShadow: SHADOWS.glow.icon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{
                mb: 1,
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                background: 'rgba(139, 92, 246, 0.1)',
                color: theme.palette.secondary.main
              }}>
                University Manager Portal
              </Typography>
              <GradientText variant="h3" component="h1" sx={{ mb: 1 }}>
                Welcome Back
              </GradientText>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
                Securely access your university management dashboard.
              </Typography>
            </Box>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ textAlign: 'center', bgcolor: 'rgba(239, 68, 68, 0.1)', p: 1, borderRadius: 2 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  mt: 1,
                  borderRadius: 2,
                }}
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
