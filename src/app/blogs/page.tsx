import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, BookOpen, Tag, Share2, MessageSquare, Heart, Search } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { getAllBlogPosts, getFeaturedBlogPost, getAllCategories, sampleBlogPosts, BlogPost } from '@/lib/sanityBlogService';

async function getBlogData() {
  try {
    const posts = await getAllBlogPosts();
    const featuredPost = await getFeaturedBlogPost();
    const categories = await getAllCategories();
    
    // If no posts are found, use sample data
    return {
      posts: posts.length > 0 ? posts : sampleBlogPosts,
      featuredPost: featuredPost || sampleBlogPosts[0],
      categories: categories.length > 0 ? categories : [
        { _id: '1', title: 'Study Tips', slug: { current: 'study-tips' } },
        { _id: '2', title: 'Technology', slug: { current: 'technology' } },
        { _id: '3', title: 'Online Learning', slug: { current: 'online-learning' } }
      ]
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      posts: sampleBlogPosts,
      featuredPost: sampleBlogPosts[0],
      categories: [
        { _id: '1', title: 'Study Tips', slug: { current: 'study-tips' } },
        { _id: '2', title: 'Technology', slug: { current: 'technology' } },
        { _id: '3', title: 'Online Learning', slug: { current: 'online-learning' } }
      ]
    };
  }
}

// Legacy sample data for reference

// We're now using dynamic data from Sanity instead of static data

export const metadata: Metadata = {
  title: "Blog - EduGenius | Educational Insights & Resources",
  description: "Discover the latest articles, study tips, and educational resources to enhance your learning journey with EduGenius.",
  keywords: ["EduGenius Blogs vercel", "education blog", "learning tips", "edtech", "study techniques", "online learning", "AI in Education", "Future of Learning", "Pakistan", "Study Skills", "Productivity", "Learning"],
  openGraph: {
    title: "EduGenius Blog - Empowering the Future of Education",
    description: "Discover articles, guides, and insights to enhance your learning journey with EduGenius.",
    type: "website",
    locale: "en_US",
    url: "https://mj-edugenius.vercel.app/blog",
    siteName: "EduGenius"
  }
};

// Category filter component
const CategoryFilter = () => {
  const categories = ["All", "Technology", "Study Tips", "Online Education", "Career Guidance"];
  
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          className="rounded-full px-4 py-1 text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ post }: { post: BlogPost }) => (
  <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md dark:border-gray-800">
    <div className="relative h-48 overflow-hidden">
      <Image
        src={post.mainImage}
        alt={post.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {post.categories && post.categories.length > 0 ? post.categories[0].title : 'Uncategorized'}
      </div>
    </div>
    
    <div className="flex-1 p-6">
      <div className="mb-2 flex items-center space-x-2 text-sm text-muted-foreground">
        <span className="flex items-center">
          <Calendar className="mr-1 h-3.5 w-3.5" />
          {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span>•</span>
        <span className="flex items-center">
          <Clock className="mr-1 h-3.5 w-3.5" />
          {post.readTime} min read
        </span>
      </div>
      
      <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight text-foreground">
        <Link href={`/blogs/${post.slug.current}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h2>
      
      <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span 
            key={tag}
            className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={post.author.image}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{post.author.role}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Heart className="mr-1 h-4 w-4" />
            {post.stats.likes}
          </span>
          <span className="flex items-center">
            <MessageSquare className="mr-1 h-4 w-4" />
            {post.stats.comments}
          </span>
          <button className="rounded-full p-1.5 hover:bg-muted">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </article>
);

// Featured Post Component
interface FeaturedPostProps {
  post: BlogPost;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  
  return (
    <div className="group relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-8 shadow-sm md:p-12">
      <div className="relative z-10">
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Featured Article
          </span>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        <p className="mb-6 max-w-2xl text-lg text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="group-hover:bg-primary/90">
            Read Article
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg" className="group-hover:bg-background">
            <BookOpen className="mr-2 h-4 w-4" />
            {post.readTime}
          </Button>
        </div>
      </div>
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
    </div>
  );
};

export default async function BlogPage() {
  const { posts, featuredPost, categories } = await getBlogData();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container relative py-12 md:py-16">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              EduGenius Blog
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Insights, tips, and resources to enhance your learning journey
            </p>
          </div>
          
          {featuredPost && <FeaturedPost post={featuredPost} />}
          
          <div className="mb-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold tracking-tight">Latest Articles</h2>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <CategoryFilter />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-primary/60 border-t">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
