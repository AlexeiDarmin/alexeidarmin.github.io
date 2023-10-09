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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

      <Typography variant="h1" sx={theme => ({
        fontSize: theme.typography.h4
      })}>
        I'm Alexei Darmin <br />
        A Frontend Engineer based in Toronto, Canada
      </Typography >
      </Box>


    </Box>
  );
}

export default App;
