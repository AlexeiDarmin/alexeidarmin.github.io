import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <Box sx={{ py: { xs: 4, sm: 8 } }}>
      <Typography variant="h1" gutterBottom>
        Alexei Darmin
      </Typography>
      <Typography variant="h2" color="text.secondary" sx={{ fontWeight: 400, mb: 4 }}>
        Frontend Engineer
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 600, mb: 4 }}>
        {/* TODO: Write your own intro */}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" component={RouterLink} to="/blog">
          Read the blog
        </Button>
        <Button variant="outlined" component={RouterLink} to="/labs">
          See the labs
        </Button>
      </Box>
    </Box>
  );
}
