import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact Us - EduGenius',
  description: 'Get in touch with the EduGenius team. We\'re here to help with any questions or feedback.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>
      
      <div className="bg-card rounded-lg shadow-md p-6">
        <ContactForm />
      </div>
      
      <div className="mt-12 text-center text-muted-foreground text-sm">
        <p>Or reach us directly at: <a href="mailto:abbasmujtaba125@gmail.com" className="text-primary hover:underline">abbasmujtaba125@gmail.com</a></p>
      </div>
      </main>
    </div>
  );
}
