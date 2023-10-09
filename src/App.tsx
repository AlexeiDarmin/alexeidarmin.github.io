import React from 'react';
import logo from './logo.svg';

import Navigation from './components/Navigation';
import { Box, Button, Typography } from '@mui/material';

function App() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <Navigation />
      <Box sx={{
        // flex: 2,
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>

        <Typography variant="h1" sx={theme => ({
          // fontSize: theme.typography.h4
          display: 'flex',
          justifyContent: 'center',
          mt: theme.spacing(7),
          fontWeight: 600
        })}>
          Alexei Darmin
        </Typography >
        <br />
        <Typography variant='h2' sx={{
          fontSize: '3rem',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          Frontend Engineer
        </Typography>

        {/* <Button variant="outlined" sx={ theme => ({
            alignSelf: 'center',
            mt: theme.spacing(2)
          })}>About me</Button> */}
      </Box>
    </Box>
  );
}

export default App;
