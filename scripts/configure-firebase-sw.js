#!/usr/bin/env node

/**
 * Firebase Service Worker Configuration Helper
 * 
 * This script automatically updates the firebase-messaging-sw.js file
 * with your Firebase configuration from environment variables.
 * 
 * Usage: node scripts/configure-firebase-sw.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const serviceWorkerPath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function updateServiceWorker() {
  console.log('🔥 Configuring Firebase Service Worker...');

  // Check if all required environment variables are present
  const missingVars = Object.entries(firebaseConfig)
    .filter(([key, value]) => !value || value.startsWith('your-'))
    .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

  if (missingVars.length > 0) {
    console.error('❌ Missing or invalid environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n📝 Please update your .env.local file with valid Firebase configuration.');
    console.error('📖 See FIREBASE_SETUP.md for detailed instructions.');
    process.exit(1);
  }

  try {
    // Read the current service worker file
    let serviceWorkerContent = fs.readFileSync(serviceWorkerPath, 'utf8');

    // Replace the Firebase configuration
    const configString = `const firebaseConfig = {
  apiKey: "${firebaseConfig.apiKey}",
  authDomain: "${firebaseConfig.authDomain}",
  projectId: "${firebaseConfig.projectId}",
  storageBucket: "${firebaseConfig.storageBucket}",
  messagingSenderId: "${firebaseConfig.messagingSenderId}",
  appId: "${firebaseConfig.appId}"
};`;

    // Find and replace the configuration block
    const configRegex = /const firebaseConfig = \{[\s\S]*?\};/;
    
    if (configRegex.test(serviceWorkerContent)) {
      serviceWorkerContent = serviceWorkerContent.replace(configRegex, configString);
    } else {
      console.error('❌ Could not find Firebase configuration block in service worker file.');
      process.exit(1);
    }

    // Write the updated content back to the file
    fs.writeFileSync(serviceWorkerPath, serviceWorkerContent, 'utf8');

    console.log('✅ Firebase Service Worker configured successfully!');
    console.log('🚀 You can now restart your development server and test notifications.');

  } catch (error) {
    console.error('❌ Error updating service worker:', error.message);
    process.exit(1);
  }
}

function main() {
  console.log('🔧 Firebase Service Worker Configuration Helper');
  console.log('===============================================\n');

  // Check if .env.local exists
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found.');
    console.error('📝 Please create .env.local with your Firebase configuration.');
    console.error('📖 See FIREBASE_SETUP.md for instructions.');
    process.exit(1);
  }

  // Check if service worker file exists
  if (!fs.existsSync(serviceWorkerPath)) {
    console.error('❌ firebase-messaging-sw.js not found at:', serviceWorkerPath);
    process.exit(1);
  }

  updateServiceWorker();
}

if (require.main === module) {
  main();
}

module.exports = { updateServiceWorker };