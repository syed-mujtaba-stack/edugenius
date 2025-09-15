'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, MessageCircle, User, Mail } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  
  const YOUR_PHONE_NUMBER = '+92 3460630802'; // Replace with your actual WhatsApp number in international format (e.g., 1234567890)
  
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    // Format the message for WhatsApp
    const message = `*New Contact Form Submission*%0A%0A` +
                   `*Name:* ${data.name}%0A` +
                   `*Email:* ${data.email}%0A` +
                   `*Message:*%0A${data.message}`;
    
    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/${YOUR_PHONE_NUMBER}?text=${message}`, '_blank');
    
    // Reset form and show success message
    reset();
    setIsSuccess(true);
    setIsSubmitting(false);
    
    // Hide success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isSuccess && (
        <div className="p-4 mb-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800">
          Message sent successfully! We'll get back to you soon via WhatsApp.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Your Name
          </Label>
          <div className="relative">
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name', { required: 'Name is required' })}
              className="pl-10"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="pl-10"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Your Message
        </Label>
        <Textarea
          id="message"
          placeholder="How can we help you?"
          rows={5}
          {...register('message', {
            required: 'Message is required',
            minLength: {
              value: 10,
              message: 'Message must be at least 10 characters',
            },
          })}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send via WhatsApp'
          )}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        By submitting this form, you'll be redirected to WhatsApp to complete your message.
      </p>
    </form>
  );
}
