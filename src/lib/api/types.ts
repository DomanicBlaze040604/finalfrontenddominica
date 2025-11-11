export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  color: string;
  icon: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  title?: string;
  professionalBackground?: string;
  specialization?: string[];
  expertise?: string[];
  isActive?: boolean;
  articlesCount?: number;
  articleCount?: number;
  location?: string;
  phone?: string;
  website?: string;
  joinDate?: string;
  profileUrl?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Embed {
  type: string;
  url?: string;
  embedCode?: string;
  caption?: string;
  width?: string;
  height?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  gallery?: string[];
  embeds?: Embed[];
  author: Author;
  category?: Category | null;
  categories?: Category[]; // Multiple categories support
  tags?: string[];
  status: 'draft' | 'published' | 'scheduled';
  isPinned?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  publishedAt?: string;
  scheduledAt?: string | null;
  scheduledFor?: string | null;
  createdAt: string;
  updatedAt: string;
  url: string;
  views?: number;
  likes?: number;
  shares?: number;
  comments?: any[];
  readingTime?: number;
  location?: string;
  language?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface ArticlesParams {
  limit?: number;
  page?: number;
  sort?: string;
  category?: string;
  author?: string;
  authorId?: string;
  search?: string;
  status?: 'draft' | 'published' | 'scheduled';
  isPinned?: boolean;
  isFeatured?: boolean;
}

export interface CreateArticleData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  gallery?: string[];
  embeds?: Embed[];
  authorId: string;
  categoryId?: string;
  categoryIds?: string[]; // Multiple categories support
  tags?: string[];
  status: 'draft' | 'published' | 'scheduled';
  isPinned?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  scheduledAt?: string;
  scheduledFor?: string;
  location?: string;
  language?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}
