import React, { useState } from 'react';
import { Box, Button, FormControlLabel, Link, Switch, Theme } from '@mui/material';
import { primaryColors } from '../utils/theme';

const buttonStyles = (theme: Theme) => ({
  marginX: theme.spacing(1)
})

function Navigation() {
  const [isNightMode, setIsNightMode] = useState(false)


  return (
    <Box sx={{
      // background: 'black',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Box sx={theme => ({
        width: 1000,
        // background: '#3f3f3f',
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(2)
      })}>


      <Box sx={ theme => ({
        color: primaryColors.orange,
        fontSize: theme.typography.h5,
        // fontWeight: 600,
      })}>Alexei Darmin</ Box>

      <Box >
        <Button variant="outlined" sx={buttonStyles}>About</Button>
        <Button variant="outlined" sx={buttonStyles}>Blog</Button>
        <Button variant="outlined" sx={buttonStyles}>Bookshelf</Button>
        <FormControlLabel 
          control={<Switch checked={isNightMode} onChange={(_, value) => setIsNightMode(value)} />} 
          label={isNightMode ? "night mode" : "day mode"} 
          sx={theme => ({
            width: 140,
            ml: theme.spacing(1)
          })}
        />
      </Box>
      </Box>
    </Box>
  );
}

export default Navigation;
