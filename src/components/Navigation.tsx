import React from 'react';
import { Box, Button } from '@mui/material';
import { primaryColors } from '../utils/theme';

function Navigation() {
  return (
    <Box sx={{
      background: 'black',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Box sx={{
        width: 1000,
        background: '#3f3f3f',
        display: 'flex'
      }}>


      <Box sx={ theme => ({
        color: primaryColors.orange,
        fontSize: theme.typography.h5,
        fontWeight: 600,
        padding: theme.spacing(2)
      })}>Alexei Darmin</ Box>

      <Box className="right-nav">
        <Button>About</Button>
      </Box>
      </Box>
    </Box>
  );
}

export default Navigation;
