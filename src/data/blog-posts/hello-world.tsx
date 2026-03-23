import Typography from '@mui/material/Typography';
import type { BlogPostEntry } from '../blog-types';

const post: BlogPostEntry = {
  slug: 'hello-world',
  title: 'Hello, World',
  date: '2026-03-22',
  summary: '', // TODO: Write your summary
  content: (
    <>
      <Typography variant="body1" paragraph>
        {/* TODO: Write your first post */}
      </Typography>
    </>
  ),
};

export default post;
