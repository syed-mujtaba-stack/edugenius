import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SubscriptionRequest {
  userId: string;
  token: string;
  deviceInfo?: {
    platform: string;
    userAgent: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
}

// POST subscribe to notifications (save FCM token)
export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionRequest = await request.json();
    const { userId, token, deviceInfo } = body;

    if (!userId || !token) {
      return NextResponse.json(
        { error: 'userId and token are required' },
        { status: 400 }
      );
    }

    // Save token to user tokens collection
    const userTokenRef = doc(db, 'userTokens', userId);
    const tokenData = {
      token,
      updatedAt: new Date(),
      platform: deviceInfo?.platform || 'web',
      userAgent: deviceInfo?.userAgent || '',
      deviceType: deviceInfo?.deviceType || 'desktop',
      isActive: true,
    };

    const userTokenDoc = await getDoc(userTokenRef);

    if (userTokenDoc.exists()) {
      await updateDoc(userTokenRef, tokenData);
    } else {
      await setDoc(userTokenRef, {
        ...tokenData,
        createdAt: new Date(),
      });
    }

    // Also update the user's main document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        fcmToken: token,
        notificationsEnabled: true,
        lastTokenUpdate: new Date(),
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        fcmToken: token,
        notificationsEnabled: true,
        lastTokenUpdate: new Date(),
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to notifications',
      token,
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE unsubscribe from notifications (remove FCM token)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Remove token from user tokens collection
    const userTokenRef = doc(db, 'userTokens', userId);
    const userTokenDoc = await getDoc(userTokenRef);

    if (userTokenDoc.exists()) {
      await updateDoc(userTokenRef, {
        isActive: false,
        unsubscribedAt: new Date(),
      });
    }

    // Update user's main document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        fcmToken: null,
        notificationsEnabled: false,
        lastTokenUpdate: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from notifications',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return NextResponse.json({
        success: true,
        isSubscribed: !!userData.fcmToken && userData.notificationsEnabled !== false,
        token: userData.fcmToken || null,
        lastUpdate: userData.lastTokenUpdate || null,
      });
    } else {
      return NextResponse.json({
        success: true,
        isSubscribed: false,
        token: null,
        lastUpdate: null,
      });
    }
  } catch (error) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}