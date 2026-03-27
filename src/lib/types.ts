export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  draft: boolean;
  categories: string[];
  image: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: string;
  readingTime: string;
  content: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: string;
  readingTime: string;
}

export interface WikiFrontmatter {
  title: string;
  description: string;
  order: number;
  draft: boolean;
}

export interface WikiPage {
  slug: string;
  title: string;
  description: string;
  order: number;
  content: string;
}

export interface WikiPageMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
}

export interface WikiSection {
  title: string;
  slug: string;
  description: string;
  order: number;
  pages: WikiPageMeta[];
  children: WikiSection[];
}
