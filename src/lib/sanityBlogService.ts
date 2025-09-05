import { sanityFetch } from '@/sanity/lib/sanityFetch'
import {
  allBlogPostsQuery,
  blogPostBySlugQuery,
  allCategoriesQuery,
  featuredBlogPostQuery,
  blogPostsByCategoryQuery,
} from '@/sanity/lib/queries'

export interface Author {
  name: string
  role: string
  image: string
  bio?: any
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
}

export interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  author: Author
  mainImage: string
  categories: Category[]
  publishedAt: string
  readTime: number
  tags: string[]
  stats: {
    likes: number
    comments: number
    shares: number
  }
  body?: any
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await sanityFetch<BlogPost[]>(allBlogPostsQuery)
    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await sanityFetch<BlogPost>(blogPostBySlugQuery, { slug })
    return post
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await sanityFetch<Category[]>(allCategoriesQuery)
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getFeaturedBlogPost(): Promise<BlogPost | null> {
  try {
    const post = await sanityFetch<BlogPost>(featuredBlogPostQuery)
    return post
  } catch (error) {
    console.error('Error fetching featured blog post:', error)
    return null
  }
}

export async function getBlogPostsByCategory(categoryId: string): Promise<BlogPost[]> {
  try {
    const posts = await sanityFetch<BlogPost[]>(blogPostsByCategoryQuery, { categoryId })
    return posts
  } catch (error) {
    console.error(`Error fetching blog posts for category ${categoryId}:`, error)
    return []
  }
}

// Fallback data for when Sanity is not configured or during development
export const sampleBlogPosts: BlogPost[] = [
  {
    _id: '1',
    title: 'Effective Study Techniques for Pakistani Students',
    slug: { current: 'effective-study-techniques-pakistani-students' },
    excerpt: 'Discover proven study methods tailored for Pakistani students to improve retention and exam performance.',
    author: {
      name: 'Syed Mujtaba Abbas',
      role: 'Lead Developer & AI Engineer',
      image: '/images/blog/avatar-1.jpg'
    },
    mainImage: '/images/blog/study-tips.jpg',
    categories: [
      { _id: '1', title: 'Study Tips', slug: { current: 'study-tips' }, color: '#4CAF50' }
    ],
    publishedAt: '2024-05-10T00:00:00Z',
    readTime: 7,
    tags: ['Study Skills', 'Productivity', 'Learning'],
    stats: {
      likes: 98,
      comments: 15,
      shares: 27
    }
  },
  {
    _id: '2',
    title: 'How AI is Transforming Education in Pakistan',
    slug: { current: 'ai-transforming-education-pakistan' },
    excerpt: 'Explore how artificial intelligence is revolutionizing the educational landscape in Pakistan and creating new opportunities.',
    author: {
      name: 'Syed Mujtaba Abbas',
      role: 'Education Technology Specialist',
      image: '/images/blog/avatar-1.jpg'
    },
    mainImage: '/images/blog/ai-education.jpg',
    categories: [
      { _id: '2', title: 'Technology', slug: { current: 'technology' }, color: '#2196F3' }
    ],
    publishedAt: '2024-05-15T00:00:00Z',
    readTime: 5,
    tags: ['AI', 'EdTech', 'Innovation'],
    stats: {
      likes: 120,
      comments: 22,
      shares: 45
    }
  },
  {
    _id: '3',
    title: 'The Future of Online Learning in Pakistan',
    slug: { current: 'future-online-learning-pakistan' },
    excerpt: 'Discover how digital education is transforming Pakistan\'s educational landscape, breaking barriers, and creating new opportunities for students nationwide.',
    author: {
      name: 'Syed Mujtaba Abbas',
      role: 'Lead Developer & AI Engineer',
      image: '/images/blog/avatar-1.jpg'
    },
    mainImage: '/images/blog/online-learning.jpg',
    categories: [
      { _id: '3', title: 'Online Learning', slug: { current: 'online-learning' }, color: '#FF9800' }
    ],
    publishedAt: '2024-05-20T00:00:00Z',
    readTime: 6,
    tags: ['Digital Education', 'Remote Learning', 'Educational Policy'],
    stats: {
      likes: 85,
      comments: 12,
      shares: 30
    }
  }
];