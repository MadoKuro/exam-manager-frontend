import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to the Home Page!
        </Typography>
        <Typography variant="body1">
          You are now logged in.
        </Typography>
      </Box>
    </Container>
  );
}
