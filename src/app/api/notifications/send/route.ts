import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { db } from '@/lib/firebase';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

interface SendNotificationRequest {
  userId?: string;
  userIds?: string[];
  title: string;
  body: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  data?: Record<string, any>;
  sendPush?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendNotificationRequest = await request.json();
    const { userId, userIds, title, body: notificationBody, type = 'info', actionUrl, data, sendPush = true } = body;

    // Validate required fields
    if (!title || !notificationBody) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    if (!userId && !userIds) {
      return NextResponse.json(
        { error: 'userId or userIds must be provided' },
        { status: 400 }
      );
    }

    const targetUserIds = userId ? [userId] : userIds!;
    const results = [];

    for (const targetUserId of targetUserIds) {
      try {
        // Save notification to Firestore
        const notificationRef = await addDoc(collection(db, 'notifications'), {
          userId: targetUserId,
          title,
          body: notificationBody,
          type,
          actionUrl,
          data,
          read: false,
          timestamp: new Date(),
          createdAt: new Date(),
        });

        let pushResult = null;

        // Send push notification if requested and user has FCM token
        if (sendPush) {
          try {
            const userRef = doc(db, 'users', targetUserId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const fcmToken = userData.fcmToken;

              if (fcmToken) {
                const messaging = getMessaging();
                const message = {
                  token: fcmToken,
                  notification: {
                    title,
                    body: notificationBody,
                  },
                  data: {
                    type,
                    actionUrl: actionUrl || '',
                    notificationId: notificationRef.id,
                    ...data,
                  },
                  android: {
                    notification: {
                      icon: '/icons/icon1-192.png',
                      color: '#4F46E5',
                      sound: 'default',
                      clickAction: actionUrl || '/dashboard',
                    },
                  },
                  apns: {
                    payload: {
                      aps: {
                        sound: 'default',
                        badge: 1,
                      },
                    },
                  },
                  webpush: {
                    notification: {
                      icon: '/icons/icon1-192.png',
                      badge: '/icons/icon1-96.png',
                      tag: notificationRef.id,
                      requireInteraction: true,
                      actions: [
                        {
                          action: 'open',
                          title: 'Open',
                          icon: '/icons/icon1-32.png',
                        },
                        {
                          action: 'dismiss',
                          title: 'Dismiss',
                        },
                      ],
                    },
                    fcmOptions: {
                      link: actionUrl || '/dashboard',
                    },
                  },
                };

                const pushResponse = await messaging.send(message);
                pushResult = { success: true, messageId: pushResponse };
              } else {
                pushResult = { success: false, error: 'No FCM token found for user' };
              }
            } else {
              pushResult = { success: false, error: 'User not found' };
            }
          } catch (pushError) {
            console.error('Push notification error:', pushError);
            pushResult = { success: false, error: pushError instanceof Error ? pushError.message : 'Unknown push error' };
          }
        }

        results.push({
          userId: targetUserId,
          notificationId: notificationRef.id,
          success: true,
          push: pushResult,
        });
      } catch (userError) {
        console.error(`Error sending notification to user ${targetUserId}:`, userError);
        results.push({
          userId: targetUserId,
          success: false,
          error: userError instanceof Error ? userError.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      message: `Notifications sent: ${successCount} successful, ${failureCount} failed`,
      results,
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to send broadcast notifications
export async function POST_BROADCAST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: notificationBody, type = 'info', actionUrl, data } = body;

    // This would require getting all user tokens from Firestore
    // Implementation depends on your user management strategy
    // For now, returning not implemented
    return NextResponse.json(
      { error: 'Broadcast notifications not implemented yet' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Broadcast notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}