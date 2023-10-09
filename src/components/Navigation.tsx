import React, { useState } from 'react';
import { Box, Button, FormControlLabel, Link, Switch, Theme, colors } from '@mui/material';

const buttonStyles = (theme: Theme) => ({
  marginX: theme.spacing(1)
})

function Navigation() {
  const [isNightMode, setIsNightMode] = useState(false)


  return (
    <Box sx={ theme => ({
      // background: 'black',
      display: 'flex',
      justifyContent: 'center',
      borderBottom: `1px solid ${theme.palette.primary.main}`
    })}>
      <Box sx={theme => ({
        width: 1000,
        // background: '#3f3f3f',
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(1.5)
      })}>


      {/* <Box sx={ theme => ({
        // color: theme.palette.primary.contrastText,
        fontSize: theme.typography.h6,
        fontWeight: 100,
        color: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center'
      })}>Alexei Darmin</ Box> */}

      <Box >
        {/* <Button variant="text" sx={buttonStyles}>About</Button>
        <Button variant="text" sx={buttonStyles}>Blog</Button>
        <Button variant="text" sx={buttonStyles}>Bookshelf</Button> */}
        {/* <FormControlLabel 
          control={<Switch checked={isNightMode} onChange={(_, value) => setIsNightMode(value)} />} 
          label={isNightMode ? "night mode" : "day mode"} 
          sx={theme => ({
            width: 140,
            ml: theme.spacing(1)
          })}
        /> */}
      </Box>
      </Box>
    </Box>
  );
}

export default Navigation;
