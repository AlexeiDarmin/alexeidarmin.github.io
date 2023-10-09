import React from 'react';
import logo from './logo.svg';

import Navigation from './components/Navigation';
import { Box, Typography } from '@mui/material';

function App() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <Navigation />
      <Box sx={{
        flex: 2,
        background: 'gray'
      }}>
          <Typography variant="body1"></Typography>🚧 under construction 🚧
      </Box>


    </Box>
  );
}

export default App;
