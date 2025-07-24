
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Blogs - EduGenius",
    description: "Read the latest articles, tips, and insights on education, technology, and learning from the EduGenius team.",
};

const blogPosts = [
    {
        title: "How AI is Changing the Future of Education in Pakistan",
        date: "October 26, 2024",
        excerpt: "Artificial Intelligence is no longer a futuristic concept; it's a present-day reality transforming industries, and education is no exception. In Pakistan, where educational challenges persist, AI offers a beacon of hope. Personalized learning platforms like EduGenius can analyze a student's performance to create custom study plans, focusing on their weak areas. This is a significant shift from the traditional one-size-fits-all approach. AI tutors provide 24/7 support, ensuring no student is left behind due to a lack of resources. Furthermore, AI-powered tools are making career counseling more accessible, guiding students toward professions that match their skills and interests, which is crucial for the nation's future workforce.",
    },
    {
        title: "5 Proven Study Techniques to Ace Your Next Exam",
        date: "October 20, 2024",
        excerpt: "Exams can be stressful, but with the right strategies, you can boost your confidence and performance. Here are five proven techniques: 1. **Active Recall:** Instead of passively re-reading notes, actively try to recall information from memory. Use flashcards or platforms like EduGenius to generate Q&As on a topic. 2. **Spaced Repetition:** Review information at increasing intervals over time. This technique helps embed knowledge into your long-term memory. 3. **The Feynman Technique:** Try to explain a concept in simple terms, as if you were teaching it to a child. This quickly reveals gaps in your understanding. 4. **Practice Testing:** Regularly take practice tests under exam-like conditions. Our AI Test Generator is perfect for this. 5. **Interleaving:** Mix up different subjects or topics during your study sessions rather than studying one topic for a long block of time.",
    },
    {
        title: "Choosing the Right Career Path After Intermediate",
        date: "October 15, 2024",
        excerpt: "The years after Intermediate are crucial for career decisions. With so many options, how do you choose the right one? The first step is self-assessment: identify your interests, strengths, and what you enjoy doing. Are you good with numbers, creative, or a problem-solver? Platforms like EduGenius's AI Career Counselor can help you analyze these traits. Next, research potential careers that align with your profile. Look into the required education, job prospects, and daily responsibilities. Don't be afraid to explore modern fields like Data Science, AI, or Digital Marketing alongside traditional paths like Engineering and Medicine. The key is to make an informed decision that aligns with your passion and potential.",
    }
];

export default function BlogsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-4xl font-headline md:text-5xl">Our Blogs</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Insights, tips, and stories about learning and technology.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 {blogPosts.map((post, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 pt-2">
                                <Calendar className="h-4 w-4" /> {post.date}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{post.excerpt}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="link" className="px-0" asChild>
                                <Link href="#">
                                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          </div>
        </section>

      </main>
       <footer className="py-6 text-center text-sm text-primary/60 border-t">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
