
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
    title: "Privacy Policy - EduGenius",
    description: "Read the privacy policy for EduGenius. We are committed to protecting your data and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="prose prose-invert max-w-none mx-auto">
            <h1>Privacy Policy for EduGenius</h1>
            <p><strong>Last Updated:</strong> July 27, 2024</p>

            <h2>1. Introduction</h2>
            <p>Welcome to EduGenius. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>

            <h2>2. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application or otherwise when you contact us.</p>
            <p>The personal information we collect includes the following:</p>
            <ul>
                <li><strong>Personal Information Provided by You:</strong> We collect names; email addresses; passwords; and other similar information.</li>
                <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by our payment processor.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            <ul>
                <li>To facilitate account creation and logon process.</li>
                <li>To post testimonials.</li>
                <li>To manage user accounts.</li>
                <li>To send administrative information to you.</li>
            </ul>
            
            <h2>4. Will Your Information Be Shared With Anyone?</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

            <h2>5. How We Keep Your Information Safe</h2>
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>

             <h2>6. Do We Make Updates to This Policy?</h2>
            <p>Yes, we will update this policy as necessary to stay compliant with relevant laws. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        </div>
      </main>
       <footer className="py-6 text-center text-sm text-primary/60 border-t">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
