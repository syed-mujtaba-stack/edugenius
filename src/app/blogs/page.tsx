import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, BookOpen, Tag, Share2, MessageSquare, Heart, Search } from 'lucide-react';
import { Navbar } from '@/components/navbar';

// Sample blog data with images
const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Education",
    slug: "ai-in-education",
    excerpt: "Discover how artificial intelligence is transforming traditional education systems and creating personalized learning experiences for students worldwide.",
    content: `Artificial Intelligence (AI) is no longer a futuristic concept but a present reality that's reshaping the educational landscape. As a Lead Developer & AI Engineer, I've witnessed firsthand how AI technologies are creating more engaging, personalized, and effective learning experiences.

## The Rise of Personalized Learning
AI-powered adaptive learning systems analyze student performance in real-time, adjusting the curriculum to match individual learning paces and styles. This personalization ensures that no student is left behind, as the system identifies knowledge gaps and provides targeted exercises to address them.

## Automating Administrative Tasks
Educators spend countless hours on administrative tasks like grading and attendance. AI can automate these processes, allowing teachers to focus on what they do best—teaching. Automated grading systems can evaluate multiple-choice tests and even written responses with impressive accuracy.

## Breaking Language Barriers
AI-powered translation tools are making education more accessible to non-native speakers. Real-time translation enables students to learn in their preferred language while still accessing high-quality educational content from around the world.

## The Future of AI in Education
As we move forward, we can expect to see:
- More sophisticated virtual tutors
- Enhanced accessibility features for students with disabilities
- Predictive analytics to identify at-risk students
- Immersive learning experiences through AI and VR integration

At EduGenius, we're committed to harnessing these technologies to create a more inclusive and effective learning environment for all students.`,
    date: "May 15, 2024",
    readTime: "5 min read",
    category: "Technology",
    tags: ["AI", "EdTech", "Future of Learning"],
    image: "/images/blog/ai-education.jpg",
    author: {
      name: "Syed Mujtaba Abbas",
      role: "Lead Developer & AI Engineer",
      avatar: "/images/blog/avatar-1.jpg"
    },  
    stats: {
      likes: 124,
      comments: 28,
      shares: 42
    }
  },
  {
    id: 2,
    title: "Mastering Study Techniques",
    slug: "study-techniques",
    excerpt: "Unlock your academic potential with these scientifically-proven study techniques that boost retention and performance.",
    content: `As someone who has navigated the challenging waters of academic excellence, I've discovered that effective studying isn't about working harder—it's about working smarter. In this comprehensive guide, I'll share the most effective study techniques that have helped countless students achieve academic success.

## The Science of Spaced Repetition
Spaced repetition is one of the most powerful learning techniques available. Instead of cramming, this method involves reviewing material over increasing intervals of time. Here's how to implement it:
- First review: 1 day after learning
- Second review: 3 days later
- Third review: 1 week later
- Fourth review: 2 weeks later

## Active Recall: The Key to Retention
Active recall forces your brain to retrieve information rather than passively reviewing it. Try these methods:
- Create flashcards and test yourself regularly
- Explain concepts out loud without looking at your notes
- Teach the material to someone else

## The Pomodoro Technique
This time management method can significantly boost productivity:
1. Study for 25 minutes of focused work
2. Take a 5-minute break
3. After four cycles, take a longer 15-30 minute break

## Effective Note-Taking Strategies
- Use the Cornell Note-Taking System
- Create mind maps for complex topics
- Summarize information in your own words
- Use color coding for better organization

## Optimizing Your Study Environment
- Find a quiet, well-lit space
- Eliminate digital distractions
- Keep your study area organized
- Use background music or white noise if it helps you focus

Remember, consistency is key. Implementing these techniques regularly will yield better results than last-minute cramming sessions. At EduGenius, we're committed to helping students develop these essential skills for lifelong learning.`,
    date: "May 10, 2024",
    readTime: "7 min read",
    category: "Study Tips",
    tags: ["Study Skills", "Productivity", "Learning"],
    image: "/images/blog/study-tips.jpg",
    author: {
      name: "Syed Mujtaba Abbas",
      role: "Lead Developer & AI Engineer",
      avatar: "/images/blog/avatar-1.jpg"
    },
    stats: {
      likes: 98,
      comments: 15,
      shares: 27
    }
  },
  {
    id: 3,
    title: "The Future of Online Learning in Pakistan",
    slug: "future-online-learning-pakistan",
    excerpt: "Discover how digital education is transforming Pakistan's educational landscape, breaking barriers, and creating new opportunities for students nationwide.",
    content: `The COVID-19 pandemic served as a catalyst for digital education worldwide, but perhaps nowhere has this transformation been more impactful than in Pakistan. As someone deeply involved in educational technology, I've witnessed how online learning is revolutionizing access to quality education across the country.

## The Digital Education Revolution in Pakistan
Pakistan's education sector has long faced challenges including limited access to quality institutions, especially in rural areas. However, the rise of online learning platforms has begun to bridge this gap, offering several key benefits:

### 1. Increased Accessibility
- Students from remote areas can now access quality education
- Flexible learning schedules accommodate working professionals
- Reduced costs compared to traditional education

### 2. Quality Content Delivery
- Access to international standard curriculum
- Interactive learning materials and multimedia content
- Opportunities for self-paced learning

## Challenges and Solutions
While the potential is immense, several challenges remain:

### Internet Connectivity
- **Challenge:** Uneven internet access across regions
- **Solution:** Offline content access and low-bandwidth optimization

### Digital Literacy
- **Challenge:** Varying levels of technical proficiency
- **Solution:** User-friendly platforms and digital literacy programs

### Quality Assurance
- **Challenge:** Ensuring educational standards
- **Solution:** Accreditation systems and quality control measures

## The Road Ahead
The future of online education in Pakistan looks promising with:
- Government initiatives to improve digital infrastructure
- Growing number of edtech startups
- Increasing smartphone penetration
- Greater acceptance of online credentials by employers

At EduGenius, we're proud to be part of this educational transformation, providing accessible, high-quality learning opportunities to students across Pakistan. Our platform combines cutting-edge technology with locally relevant content to create meaningful learning experiences.

As we move forward, we remain committed to:
- Expanding access to underserved communities
- Developing localized content
- Partnering with educational institutions
- Continuously improving our platform based on user feedback

Join us in shaping the future of education in Pakistan!`,
    date: "October 15, 2024",
    readTime: "6 min read",
    category: "Online Education",
    tags: ["E-Learning", "EdTech", "Pakistan"],
    image: "/images/blog/online-learning.jpg",
    author: {
      name: "Syed Mujtaba Abbas",
      role: "Lead Developer & AI Engineer",
      avatar: "/images/blog/avatar-1.jpg"
    },
    stats: {
      likes: 198,
      comments: 28,
      shares: 39
    }
  }
];

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
const BlogCard = ({ post }: { post: typeof blogPosts[0] }) => (
  <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md dark:border-gray-800">
    <div className="relative h-48 overflow-hidden">
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {post.category}
      </div>
    </div>
    
    <div className="flex-1 p-6">
      <div className="mb-2 flex items-center space-x-2 text-sm text-muted-foreground">
        <span className="flex items-center">
          <Calendar className="mr-1 h-3.5 w-3.5" />
          {post.date}
        </span>
        <span>•</span>
        <span className="flex items-center">
          <Clock className="mr-1 h-3.5 w-3.5" />
          {post.readTime}
        </span>
      </div>
      
      <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight text-foreground">
        <Link href={`/blogs/${post.slug}`} className="after:absolute after:inset-0">
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
              src={post.author.avatar}
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
const FeaturedPost = () => {
  const featuredPost = blogPosts[0];
  
  return (
    <div className="group relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-8 shadow-sm md:p-12">
      <div className="relative z-10">
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Featured Article
          </span>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {featuredPost.title}
        </h1>
        <p className="mb-6 max-w-2xl text-lg text-muted-foreground">
          {featuredPost.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="group-hover:bg-primary/90">
            Read Article
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg" className="group-hover:bg-background">
            <BookOpen className="mr-2 h-4 w-4" />
            {featuredPost.readTime}
          </Button>
        </div>
      </div>
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
    </div>
  );
};

export default function BlogPage() {
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
          
          <FeaturedPost />
          
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
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
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
