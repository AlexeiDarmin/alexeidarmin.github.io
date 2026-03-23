import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <>
      <Navigation />
      <Container
        maxWidth="md"
        sx={{ flex: 1, py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 3 } }}
      >
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Alexei Darmin
        </Typography>
      </Box>
    </>
  );
}
