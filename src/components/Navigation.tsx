import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'Labs', path: '/labs' },
  { label: 'About', path: '/about' },
];

export default function Navigation() {
  const { pathname } = useLocation();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar
        sx={{ maxWidth: 900, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}
      >
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            textDecoration: 'none',
            mr: 4,
          }}
        >
          AD
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map(({ label, path }) => {
            const isActive =
              path === '/' ? pathname === '/' : pathname.startsWith(path);
            return (
              <Button
                key={path}
                component={RouterLink}
                to={path}
                size="small"
                sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
