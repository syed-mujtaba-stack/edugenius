
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Privacy Policy - EduGenius",
    description: "Comprehensive privacy policy for EduGenius. Learn how we collect, use, and protect your personal information in compliance with global privacy regulations.",
    keywords: ["privacy policy", "data protection", "GDPR", "CCPA", "data privacy", "EduGenius"],
};

const LastUpdated = 'September 15, 2025';

const PrivacyPolicyLink = ({ children, href }: { children: React.ReactNode, href: string }) => (
  <Link href={href} className="text-primary hover:underline">{children}</Link>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="prose prose-invert max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {LastUpdated}</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to EduGenius ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <PrivacyPolicyLink href="https://edugenius.com">edugenius.com</PrivacyPolicyLink> and our mobile application (collectively, the "Service").
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect several types of information from and about users of our Service, including:</p>
            
            <h3 className="text-xl font-medium mt-6 mb-2">2.1 Personal Information</h3>
            <p className="mb-4">When you register for an account, we may ask for your contact information, including items such as:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Full name and username</li>
              <li>Email address and phone number</li>
              <li>Date of birth and educational background</li>
              <li>Profile picture and biographical information</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-2">2.2 Payment Information</h3>
            <p className="mb-4">For paid services, we collect payment information through our payment processors. We do not store your full payment card details on our servers.</p>

            <h3 className="text-xl font-medium mt-6 mb-2">2.3 Usage Data</h3>
            <p>We automatically collect information about how you interact with our Service, including:</p>
            <ul className="list-disc pl-6 mt-2 mb-6 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Clickstream data and navigation patterns</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-2">2.4 Cookies and Tracking Technologies</h3>
            <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can set your browser to refuse all or some browser cookies, but this may limit your use of certain features.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze usage and trends</li>
              <li>Personalize your experience</li>
              <li>Detect, investigate, and prevent security incidents</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information in the following situations:</p>
            
            <h3 className="text-xl font-medium mt-6 mb-2">4.1 With Service Providers</h3>
            <p className="mb-4">We may share your data with third-party vendors who perform services on our behalf, such as payment processing, data analysis, email delivery, and customer service.</p>
            
            <h3 className="text-xl font-medium mt-6 mb-2">4.2 For Legal Compliance</h3>
            <p className="mb-4">We may disclose your information where required by law or in response to valid requests by public authorities.</p>
            
            <h3 className="text-xl font-medium mt-6 mb-2">4.3 Business Transfers</h3>
            <p>In connection with any merger, sale of company assets, or acquisition of all or a portion of our business by another company.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect your personal information, including:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and testing</li>
              <li>Access controls and authentication</li>
              <li>Security incident response procedures</li>
            </ul>
            <p>However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Your Data Protection Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights regarding your personal data:</p>
            
            <h3 className="text-xl font-medium mt-6 mb-2">6.1 GDPR Rights (EU/EEA Users)</h3>
            <p className="mb-4">If you are in the European Economic Area, you have the right to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction or deletion</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6 mb-2">6.2 CCPA Rights (California Residents)</h3>
            <p className="mb-4">California residents have the right to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Know what personal information is collected</li>
              <li>Request deletion of personal information</li>
              <li>Opt-out of the sale of personal information</li>
              <li>Non-discrimination for exercising privacy rights</li>
            </ul>
            
            <p>To exercise these rights, please contact us using the information in the "Contact Us" section below.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="mb-4">We retain your personal information only for as long as necessary to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide you with the Service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p>When we no longer need your information, we will securely delete or anonymize it.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
            <p className="mb-4">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in accordance with applicable data protection laws.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="mb-4">Our Service is not intended for children under 16. We do not knowingly collect personal information from children under 16. If we learn we have collected such information, we will take steps to delete it.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
            <p>You are advised to review this Privacy Policy periodically for any changes. Changes are effective when they are posted on this page.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="mb-2">Email: <PrivacyPolicyLink href="mailto:abbasmujtaba125@gmail.com">abbasmujtaba125@gmail.com</PrivacyPolicyLink></p>
            <p>Phone: +92 3460630802</p>
          </section>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-primary/60 border-t">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
