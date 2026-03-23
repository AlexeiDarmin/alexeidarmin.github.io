import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h1" gutterBottom>
        Alexei Darmin
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Website coming soon.
      </Typography>
    </Box>
  );
}
