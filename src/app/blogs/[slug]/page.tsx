import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, MessageSquare, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { getBlogPostBySlug, sampleBlogPosts, BlogPost } from '@/lib/sanityBlogService';

// Static blog data for the three requested posts
const staticBlogPosts = {
  'effective-study-techniques-pakistani-students': {
    _id: 'effective-study-techniques',
    title: 'Effective Study Techniques for Pakistani Students',
    slug: { current: 'effective-study-techniques-pakistani-students' },
    excerpt: 'Discover proven study techniques tailored for Pakistani students, incorporating cultural context and educational system requirements.',
    publishedAt: '2024-09-05T00:00:00.000Z',
    readTime: 8,
    tags: ['Study Tips', 'Pakistan', 'Learning Techniques', 'Productivity'],
    mainImage: '/blog/study-techniques.png',
    stats: { likes: 124, comments: 23, shares: 45 },
    author: {
      name: 'Dr. Ayesha Khan',
      role: 'Education Specialist',
      image: '/authors/ayesha-khan.jpg'
    },
    categories: [{ _id: 'cat-1', title: 'Study Tips', slug: { current: 'study-tips' } }],
    body: [
      {
        _type: 'block',
        _key: '1',
        children: [
          { _type: 'span', text: 'Pakistan\'s education system presents unique challenges and opportunities for effective learning. In this comprehensive guide, we explore study techniques specifically adapted for Pakistani students, considering the matric and intermediate curriculum, examination patterns, and cultural learning preferences.' }
        ]
      }
    ]
  },
  'ai-transforming-education-pakistan': {
    _id: 'ai-transforming-education',
    title: 'How AI is Transforming Education in Pakistan',
    slug: { current: 'ai-transforming-education-pakistan' },
    excerpt: 'Explore how artificial intelligence is revolutionizing Pakistan\'s education sector, from smart learning platforms to AI-powered tutoring systems.',
    publishedAt: '2024-09-04T00:00:00.000Z',
    readTime: 6,
    tags: ['AI', 'Education', 'Pakistan', 'Technology', 'Future Learning'],
    mainImage: '/blog/ai-education.png',
    stats: { likes: 89, comments: 31, shares: 67 },
    author: {
      name: 'Syed Mujtaba Abbas',
      role: 'Lead developer',
      image: '/images/blog/avatar-1.jpg'
    },
    categories: [{ _id: 'cat-2', title: 'Technology', slug: { current: 'technology' } }],
    body: [
      {
        _type: 'block',
        _key: '2',
        children: [
          { _type: 'span', text: 'Artificial Intelligence is rapidly transforming Pakistan\'s education landscape. From automated grading systems to personalized learning paths, AI is making education more accessible, efficient, and effective for students across urban and rural areas.' }
        ]
      }
    ]
  },
  'future-online-learning-pakistan': {
    _id: 'future-online-learning',
    title: 'The Future of Online Learning in Pakistan',
    slug: { current: 'future-online-learning-pakistan' },
    excerpt: 'A vision for the future of online education in Pakistan, exploring emerging technologies, challenges, and opportunities for digital learning growth.',
    publishedAt: '2024-09-03T00:00:00.000Z',
    readTime: 7,
    tags: ['Online Learning', 'Pakistan', 'Future', 'Digital Education', 'Technology'],
    mainImage: '/blog/future-learning.png',
    stats: { likes: 156, comments: 42, shares: 89 },
    author: {
      name: 'Ms. Fatima Zahra',
      role: 'EdTech Researcher',
      image: '/authors/fatima-zahra.jpg'
    },
    categories: [{ _id: 'cat-3', title: 'Online Learning', slug: { current: 'online-learning' } }],
    body: [
      {
        _type: 'block',
        _key: '3',
        children: [
          { _type: 'span', text: 'Pakistan\'s online learning sector is poised for significant growth. With increasing internet penetration and smartphone usage, online education offers unprecedented opportunities for educational equity and quality improvement across the country.' }
        ]
      }
    ]
  }
};

// Mock Sanity client function for these specific posts
async function getBlogPostBySlugMock(slug: string): Promise<BlogPost | null> {
  const post = staticBlogPosts[slug as keyof typeof staticBlogPosts];
  return post ? post as BlogPost : null;
}

interface BlogPostParams {
  slug: string;
}

interface BlogPostPageProps {
  params: Promise<BlogPostParams>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  let post: BlogPost | null = null;

  try {
    post = await getBlogPostBySlug(slug);
  } catch (error) {
    // For the specific requested posts, use mock data
    if (staticBlogPosts[slug as keyof typeof staticBlogPosts]) {
      post = staticBlogPosts[slug as keyof typeof staticBlogPosts] as BlogPost;
    }
  }

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - EduGenius Blog`,
    description: post.excerpt,
    keywords: [...post.tags, 'EduGenius', 'Education', 'Pakistani Students'],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.mainImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.mainImage],
    },
  };
}

// Social Share Component
const SocialShare = ({ title, url }: { title: string; url: string }) => {
  const shareLinks = [
    { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="flex items-center gap-2">
      <Share2 className="h-4 w-4" />
      <span className="text-sm font-medium">Share:</span>
      {shareLinks.map((link) => (
        <Button key={link.name} variant="ghost" size="sm" asChild>
          <Link href={link.url} target="_blank" rel="noopener noreferrer">
            {link.name}
          </Link>
        </Button>
      ))}
    </div>
  );
};

// Reading Progress Component
const ReadingProgress = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  let post: BlogPost | null = null;
  let error: boolean = false;

  try {
    post = await getBlogPostBySlug(decodedSlug);
  } catch (err) {
    error = true;
    // For the specific requested posts, use mock data
    if (staticBlogPosts[decodedSlug as keyof typeof staticBlogPosts]) {
      post = staticBlogPosts[decodedSlug as keyof typeof staticBlogPosts] as BlogPost;
      error = false;
    }
  }

  if (!post) {
    notFound();
  }

  // Default image fallbacks
  const getImageSrc = (src: string) => {
    if (src.startsWith('/')) return src;
    return '/blog/default-post-image.png';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ReadingProgress />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-16">
          <div className="container relative py-12 md:py-20">
            <div className="mx-auto max-w-4xl">
              <Link
                href="/blogs"
                className="mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Blogs
              </Link>

              <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                {post.categories && post.categories.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
                    {post.categories[0].title}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime} min read
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {post.title}
              </h1>

              <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={post.author.image.startsWith('/') ? post.author.image : '/authors/default-author.jpg'}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>

                <SocialShare
                  title={post.title}
                  url={`https://mj-edugenius.vercel.app/blogs/${decodedSlug}`}
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 w-full overflow-hidden md:h-[500px]">
            <Image
              src={getImageSrc(post.mainImage)}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Article Content */}
        <article className="container mx-auto max-w-4xl py-12 md:py-20">
          <div className="prose prose-lg mx-auto max-w-none dark:prose-invert">
            {/* Article content would be rendered here based on the body field */}
            {post.body && Array.isArray(post.body) && post.body.map((block: any, index: number) => {
              if (block._type === 'block') {
                return (
                  <p key={block._key || index} className="mb-6 text-muted-foreground leading-relaxed">
                    {block.children?.map((child: any) => child.text).join('') || ''}
                  </p>
                );
              }
              return null;
            })}

            {(!post.body || !Array.isArray(post.body)) && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This is a placeholder for the full article content. The complete blog post content would be dynamically rendered here based on the Sanity CMS data structure and the body field content.
                </p>

                <h2 className="text-2xl font-bold text-foreground">Key Insights</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Point one about the topic</li>
                  <li>Point two about the topic</li>
                  <li>Point three about the topic</li>
                </ul>

                <h2 className="text-2xl font-bold text-foreground">Conclusion</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Summary and final thoughts about the article topic.
                </p>
              </div>
            )}
          </div>

          {/* Article Footer */}
          <footer className="mt-12 border-t pt-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.stats.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {post.stats.comments}
                </span>
              </div>
            </div>
          </footer>
        </article>

        {/* Navigation */}
        <nav className="border-t bg-muted/30">
          <div className="container mx-auto max-w-4xl py-8">
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link href="/blogs" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  All Articles
                </Link>
              </Button>

              <Button asChild>
                <Link href="/blogs" className="flex items-center gap-2">
                  Next Article
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </main>

      <footer className="py-6 text-center text-sm text-primary/60 border-t">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Generate static params for the requested blog posts
export async function generateStaticParams() {
  return [
    { slug: 'effective-study-techniques-pakistani-students' },
    { slug: 'ai-transforming-education-pakistan' },
    { slug: 'future-online-learning-pakistan' },
  ];
}