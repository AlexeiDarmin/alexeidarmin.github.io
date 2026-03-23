import { type ReactNode } from 'react';

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string; // ISO date string, e.g. "2026-03-22"
  summary: string;
}

export interface BlogPostEntry extends BlogPostMeta {
  content: ReactNode;
}
