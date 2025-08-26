# Environment Variables Setup

Create a `.env.local` file in your project root and add the following variables:

```env
# Application
NEXT_PUBLIC_SITE_URL=https://mj-edugenius.vercel.app
NODE_ENV=development

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key

# Firebase Admin Configuration (for server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Google AI/Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Google Custom Search Engine
NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY=AIzaSyBDkfkydX9REt5R5eN9-yf6IpsRZY_HdhU
NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID=1244d2a1f727645aa

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# NextAuth (if using authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database (if using)
DATABASE_URL=your-database-connection-string
```

## Required Variables for Production

1. `NEXT_PUBLIC_SITE_URL` - Your production URL (https://mj-edugenius.vercel.app)
2. `NODE_ENV` - Set to 'production' in production
3. `NEXTAUTH_SECRET` - A secure random string for session encryption
4. **Firebase Configuration** - All Firebase variables are required for the app to function
5. **VAPID Key** - Required for push notifications
6. **Firebase Admin** - Required for server-side notification sending

## Firebase Setup Instructions

1. **Create a Firebase Project** at https://console.firebase.google.com/
2. **Enable Authentication** and configure sign-in methods
3. **Create Firestore Database** in production mode
4. **Generate VAPID Key** in Project Settings > Cloud Messaging
5. **Create Service Account** in Project Settings > Service Accounts
6. **Download Service Account Key** and extract the required fields

## Notification Setup

1. **Enable Cloud Messaging** in Firebase Console
2. **Configure VAPID Key** for web push notifications
3. **Set up Firestore Security Rules** to allow notification read/write
4. **Deploy Service Worker** to handle background notifications

## Generating a Secure Secret

You can generate a secure secret using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Sitemap Configuration

The sitemap will be automatically generated during build time. Ensure `NEXT_PUBLIC_SITE_URL` is set correctly for production.
