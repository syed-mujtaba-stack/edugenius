# Environment Variables Setup

Create a `.env.local` file in your project root and add the following variables:

```env
# Application
NEXT_PUBLIC_SITE_URL=https://mj-edugenius.vercel.app
NODE_ENV=development

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# NextAuth (if using authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database (if using)
DATABASE_URL=your-database-connection-string

# API Keys (if any)
GOOGLE_API_KEY=your-google-api-key
```

## Required Variables for Production

1. `NEXT_PUBLIC_SITE_URL` - Your production URL (https://mj-edugenius.vercel.app)
2. `NODE_ENV` - Set to 'production' in production
3. `NEXTAUTH_SECRET` - A secure random string for session encryption

## Generating a Secure Secret

You can generate a secure secret using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Sitemap Configuration

The sitemap will be automatically generated during build time. Ensure `NEXT_PUBLIC_SITE_URL` is set correctly for production.
