# 🚀 Supabase Realtime Database Setup Guide

## Overview

This guide will help you set up Supabase as a realtime database for your EduGenius project. Follow these steps to get everything working.

## 📋 Prerequisites

- Supabase account (free tier is sufficient)
- Node.js and npm installed
- Your EduGenius project ready

## 🛠️ Step 1: Create Supabase Project

1. **Sign up/Login to Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Create an account or login
   - Click "New Project"

2. **Create New Project**
   - Choose your organization
   - Enter project name: `edugenius-db`
   - Enter database password (save this!)
   - Select region closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 1-2 minutes
   - You'll see a dashboard when ready

## 🔑 Step 2: Get Your Supabase Keys

1. **Navigate to Settings**
   - In your Supabase dashboard
   - Go to Settings → API

2. **Copy Your Keys**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## 🔧 Step 3: Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Replace the placeholder values with your actual Supabase keys!

## 🗃️ Step 4: Set Up Database Schema

1. **Open SQL Editor**
   - In Supabase dashboard, go to SQL Editor
   - Click "New Query"

2. **Run the Schema Script**
   - Copy the entire content from `supabase/schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to Table Editor
   - You should see these tables:
     - `notifications`
     - `chat_messages`
     - `user_activities`
     - `study_sessions`

## 🔄 Step 5: Enable Realtime

1. **Enable Realtime for Tables**
   - In Supabase dashboard, go to Database → Replication
   - Find each table and toggle "Enable Realtime"
   - Enable for: `notifications`, `chat_messages`, `user_activities`, `study_sessions`

2. **Verify Realtime Settings**
   - Go to API Docs → Introduction
   - Check that realtime is enabled

## 🚀 Step 6: Test the Integration

1. **Start Your Development Server**
   ```bash
   npm run dev
   ```

2. **Test Features**
   - Navigate to `/dashboard`
   - Check for realtime notifications
   - Try the AI chat feature
   - Monitor live stats updates

## 🎯 Features Included

### 📱 Realtime Notifications
- Live notification updates
- Toast notifications for new messages
- Mark as read/unread functionality
- Delete notifications
- Unread count badge

### 💬 Realtime Chat
- AI tutor chat with live responses
- Message history synchronization
- Typing indicators
- Auto-scroll to new messages

### 📊 Live Dashboard Stats
- Real-time activity tracking
- Study session monitoring
- Live connection status
- Progressive statistics updates

### 🔄 Data Synchronization
- Automatic data updates across tabs/devices
- Optimistic updates for better UX
- Error handling and retry logic
- Connection status monitoring

## 🧪 Testing Checklist

- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Tables visible in Supabase
- [ ] Realtime enabled for all tables
- [ ] Application starts without errors
- [ ] Dashboard loads with realtime components
- [ ] Notifications system working
- [ ] Chat functionality operational
- [ ] Live stats updating
- [ ] Connection status displaying

## 🐛 Troubleshooting

### Common Issues

**1. "Missing Supabase environment variables" Error**
- Ensure all three environment variables are set in `.env.local`
- Restart your development server after updating `.env.local`

**2. Database Connection Issues**
- Verify your Supabase project is active
- Check that your API keys are correct
- Ensure your project URL is properly formatted

**3. Realtime Not Working**
- Verify realtime is enabled for your tables in Supabase dashboard
- Check browser console for connection errors
- Ensure you're using the correct table names

**4. TypeScript Errors**
- Run `npm install` to ensure all dependencies are installed
- Check that your `@supabase/supabase-js` version is up to date

### Debug Mode

To enable debug mode for better error tracking:

```typescript
// In src/lib/supabase.ts, add this to your client configuration:
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  auth: {
    debug: true // Add this for debugging
  }
})
```

## 🔒 Security Considerations

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Users can only access their own data
   - Service role key should never be exposed to client

2. **Environment Variables**
   - Keep service role key secret
   - Only expose anon key and URL to client
   - Never commit keys to version control

3. **Database Policies**
   - Review and customize RLS policies as needed
   - Test policies with different user scenarios

## 📈 Performance Tips

1. **Optimize Subscriptions**
   - Only subscribe to data you need
   - Unsubscribe when components unmount
   - Use filters to reduce data transfer

2. **Batch Operations**
   - Group related database operations
   - Use transactions for data consistency

3. **Caching Strategy**
   - Implement proper caching for frequently accessed data
   - Use optimistic updates for better UX

## 🚀 Next Steps

Once your realtime database is working:

1. **Customize the UI**
   - Modify notification styles
   - Add more chat features
   - Enhance dashboard widgets

2. **Add More Features**
   - Real-time collaboration
   - Live study groups
   - Instant messaging

3. **Scale for Production**
   - Set up proper database indexing
   - Configure backup strategies
   - Monitor performance metrics

## 🆘 Need Help?

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the browser console for errors
3. Test each component individually
4. Verify your database schema matches the expected structure

## 🎉 Congratulations!

You now have a fully functional realtime database integrated with your EduGenius project! Your users will enjoy live updates, real-time notifications, and seamless chat functionality.

---

**Happy Coding! 🚀**