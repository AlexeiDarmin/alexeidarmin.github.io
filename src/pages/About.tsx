import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

export default function About() {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        About
      </Typography>
      <Typography variant="body1" paragraph>
        {/* TODO: Write about yourself */}
      </Typography>
      <Typography variant="body1" paragraph>
        {/* TODO: Write about this site */}
      </Typography>
      <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
        Links
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Link
          href="https://github.com/alexeidarmin"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
        <Link
          href="https://linkedin.com/in/alexeidarmin"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </Link>
      </Box>
    </Box>
  );
}
