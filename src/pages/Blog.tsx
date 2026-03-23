import { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import posts from '../data/blog-posts';

type SortOrder = 'newest' | 'oldest';

export default function Blog() {
  const [sort, setSort] = useState<SortOrder>('newest');

  const sorted = useMemo(() => {
    const copy = [...posts];
    copy.sort((a, b) =>
      sort === 'newest'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
    return copy;
  }, [sort]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          mb: 4,
        }}
      >
        <Typography variant="h1">Blog</Typography>
        <Button
          size="small"
          onClick={() =>
            setSort((s) => (s === 'newest' ? 'oldest' : 'newest'))
          }
        >
          {sort === 'newest' ? '↓ Newest first' : '↑ Oldest first'}
        </Button>
      </Box>

      {sorted.length === 0 && (
        <Typography color="text.secondary">No posts yet.</Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sorted.map((post) => (
          <Box key={post.slug}>
            <Typography
              variant="h3"
              component={RouterLink}
              to={`/blog/${post.slug}`}
              sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {post.summary}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
