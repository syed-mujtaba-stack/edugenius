# 🏗️ Project Structure & Architecture

## 📁 Directory Structure

```
edugenius/
├── .github/                 # GitHub workflows and templates
├── public/                  # Static assets
│   ├── images/              # Image assets
│   ├── icons/               # App icons and favicons
│   └── fonts/               # Custom fonts
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Dashboard routes (protected)
│   │   ├── api/             # API routes
│   ├── components/          # Reusable UI components
│   ├── config/              # Configuration files
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── .env.local              # Environment variables
└── package.json            # Project dependencies
```

## 🏛️ Architecture

### Frontend
- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **State**: React Context + Hooks
- **Forms**: React Hook Form + Zod
- **Data Fetching**: SWR

### Backend
- **API**: Next.js API Routes
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage, Supabase

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local

# Start dev server
npm run dev
```

## 🛠️ Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔄 Development Workflow

1. Create feature branch
2. Implement changes
3. Write tests
4. Submit PR
5. Deploy to staging
6. Test in staging
7. Deploy to production
