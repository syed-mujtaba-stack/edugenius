'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DownloadButtonProps {
  content: string;
  filename: string;
}

export function DownloadButton({ content, filename }: DownloadButtonProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: 'Success',
        description: `${filename} has been downloaded.`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
}
