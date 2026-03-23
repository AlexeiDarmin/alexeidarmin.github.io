import { useParams, Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import posts from '../data/blog-posts';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h1" gutterBottom>
          Not found
        </Typography>
        <Typography variant="body1" paragraph>
          This post doesn't exist.
        </Typography>
        <Button component={RouterLink} to="/blog">
          ← Back to blog
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/blog"
        size="small"
        sx={{ mb: 2 }}
      >
        ← Back to blog
      </Button>
      <Typography variant="h1" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Typography>
      {post.content}
    </Box>
  );
}
