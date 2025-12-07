import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const theme = useTheme();

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
      // Background is handled by CssBaseline in theme.js
    }}>
      <Card sx={{
        minWidth: 480,
        borderRadius: 1.5,
        boxShadow: theme.palette.mode === 'light'
          ? '0 20px 40px -10px rgba(0,0,0,0.1)'
          : '0 20px 40px -10px rgba(0,0,0,0.5)',
        background: theme.palette.mode === 'light'
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.05)'}`
      }}>
        <CardContent sx={{ p: 6 }}>
          <Stack alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{
              p: 2,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="h1" fontWeight="800" sx={{ mb: 1, letterSpacing: '-0.02em' }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your university exams efficiently
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
                    borderRadius: 1.5,
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
                    borderRadius: 1.5,
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
                  mt: 1
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
