interface StructuredDataProps {
  type?: 'website' | 'article' | 'course' | 'organization';
  data?: Record<string, any>;
}

export const generateStructuredData = (type: string = 'website', customData: Record<string, any> = {}) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type === 'website' ? 'WebSite' : type.charAt(0).toUpperCase() + type.slice(1),
    "name": "EduGenius",
    "url": "https://edugenius.pk"
  };

  const typeSpecificData = {
    website: {
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://edugenius.pk/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    organization: {
      "@type": "EducationalOrganization",
      "name": "EduGenius",
      "url": "https://edugenius.pk",
      "logo": "https://edugenius.pk/images/logo.png",
      "description": "AI-powered eLearning platform for Pakistani Matric & Inter students",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PK"
      },
      "sameAs": [
        "https://facebook.com/edugeniuspk",
        "https://twitter.com/edugeniuspk",
        "https://linkedin.com/company/edugeniuspk"
      ]
    },
    course: {
      "@type": "Course",
      "name": "",
      "description": "",
      "provider": {
        "@type": "Organization",
        "name": "EduGenius",
        "sameAs": "https://edugenius.pk"
      }
    }
  };

  return {
    ...baseData,
    ...(typeSpecificData[type as keyof typeof typeSpecificData] || {}),
    ...customData
  };
};

export const StructuredData = ({ type = 'website', data = {} }: StructuredDataProps) => {
  const jsonLd = generateStructuredData(type, data);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
