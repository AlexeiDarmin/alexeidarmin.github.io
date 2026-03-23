import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import labs from '../data/labs';

export default function Labs() {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Labs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {/* TODO: Write your own description */}
      </Typography>

      <Grid container spacing={3}>
        {labs.map((lab) => (
          <Grid key={lab.title} size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea
                href={lab.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h3" gutterBottom>
                    {lab.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {lab.description}
                  </Typography>
                  {lab.tags && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {lab.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
