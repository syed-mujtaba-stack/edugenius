# Firebase Cloud Messaging Setup Guide

This guide will help you set up Firebase Cloud Messaging (FCM) for the EduGenius notification system.

## Prerequisites

- A Firebase project
- Firebase CLI installed (optional but recommended)
- Node.js v18 or later

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Cloud Messaging

1. In your Firebase project console, go to **Project Settings** (gear icon)
2. Navigate to the **Cloud Messaging** tab
3. If you don't have a Web Push certificate, click **Generate Key Pair**
4. Copy the generated **VAPID Key** - you'll need this for your environment variables

## Step 3: Get Firebase Configuration

1. In **Project Settings**, go to the **General** tab
2. Scroll down to "Your apps" section
3. If you haven't added a web app, click the web icon `</>` and follow the setup
4. Copy the Firebase config object - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Configure Environment Variables

Create or update your `.env.local` file with the Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_FROM_STEP_2

# Firebase Admin (for server-side operations)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

## Step 5: Update Service Worker Configuration

Update the `public/firebase-messaging-sw.js` file with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

**Important:** Replace the placeholder values with your actual Firebase configuration.

## Step 6: Set Up Firestore Security Rules

Add these rules to your Firestore to allow notification operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Notification rules
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /notificationPreferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /userTokens/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Test the Configuration

1. Start your development server: `npm run dev`
2. Go to `/notification-test` page
3. Run the diagnostics to check if everything is configured correctly
4. Try requesting notification permissions

## Troubleshooting

### Common Issues

1. **Service Worker Registration Failed**
   - Make sure `firebase-messaging-sw.js` has actual Firebase config values, not placeholders
   - Check browser console for detailed error messages
   - Ensure your Firebase project has Cloud Messaging enabled

2. **VAPID Key Errors**
   - Make sure you've generated a VAPID key in Firebase Console
   - Verify the VAPID key is correctly set in your environment variables
   - The VAPID key should be added to your Firebase project's Cloud Messaging settings

3. **Permission Denied**
   - Check if notifications are blocked in browser settings
   - Try in an incognito window to test without cached permissions
   - Some browsers require HTTPS for notifications (localhost is usually exempt)

4. **Token Generation Failed**
   - Verify all Firebase configuration values are correct
   - Check that Firebase project has the correct domain authorized
   - Ensure your Firebase project has Cloud Messaging API enabled

### Development Tips

- Use the `/notification-test` page to diagnose issues
- Check browser console for detailed error messages
- Test in different browsers to ensure compatibility
- Use Firebase Console's Messaging section to send test notifications

## Production Deployment

1. Ensure all environment variables are set in your hosting platform
2. Update `firebase-messaging-sw.js` with production Firebase config
3. Test notifications thoroughly before going live
4. Monitor Firebase Console for message delivery statistics

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)