import Head from 'next/head';

interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  ogType?: string;
  structuredData?: string;
}

export const SeoHead = ({
  title,
  description,
  keywords = "EduGenius, AI eLearning, Pakistan Education, Matric Studies, Inter Studies, AI Study Assistant, Online Learning Pakistan",
  canonicalUrl,
  ogImageUrl = "/images/og-image.jpg",
  ogType = "website",
  structuredData
}: SeoHeadProps) => {
  const pageTitle = `${title} | EduGenius - AI-Powered eLearning Platform`;
  
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
};
