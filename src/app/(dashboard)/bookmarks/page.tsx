import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';

export const metadata: Metadata = {
    title: "My Bookmarks",
    description: "Access all your saved courses, summaries, and tests in one place. Your bookmarked content will appear here for easy access.",
};

export default function BookmarksPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">My Bookmarks</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Saved Content</CardTitle>
          <CardDescription>All your bookmarked courses, summaries, and tests will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Bookmark className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No bookmarks yet!</p>
                <p>You can bookmark content from different pages to find it here later.</p>
             </div>
        </CardContent>
      </Card>
    </main>
  );
}
