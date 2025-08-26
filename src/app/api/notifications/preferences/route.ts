import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NotificationPreferences {
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  enableInAppNotifications: boolean;
  categories: {
    learningReminders: boolean;
    testResults: boolean;
    communityUpdates: boolean;
    systemAnnouncements: boolean;
    careerAdvice: boolean;
    weeklyProgress: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
  };
  frequency: 'immediate' | 'daily' | 'weekly';
}

const defaultPreferences: NotificationPreferences = {
  enablePushNotifications: true,
  enableEmailNotifications: true,
  enableInAppNotifications: true,
  categories: {
    learningReminders: true,
    testResults: true,
    communityUpdates: true,
    systemAnnouncements: true,
    careerAdvice: true,
    weeklyProgress: true,
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  },
  frequency: 'immediate',
};

// GET user notification preferences
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

    const preferencesRef = doc(db, 'notificationPreferences', userId);
    const preferencesDoc = await getDoc(preferencesRef);

    if (preferencesDoc.exists()) {
      return NextResponse.json({
        success: true,
        preferences: preferencesDoc.data(),
      });
    } else {
      // Return default preferences if none exist
      return NextResponse.json({
        success: true,
        preferences: defaultPreferences,
      });
    }
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST/PUT update user notification preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!preferences) {
      return NextResponse.json(
        { error: 'preferences are required' },
        { status: 400 }
      );
    }

    // Validate preferences structure
    const validatedPreferences = {
      ...defaultPreferences,
      ...preferences,
      categories: {
        ...defaultPreferences.categories,
        ...preferences.categories,
      },
      quietHours: {
        ...defaultPreferences.quietHours,
        ...preferences.quietHours,
      },
      updatedAt: new Date(),
    };

    const preferencesRef = doc(db, 'notificationPreferences', userId);
    const preferencesDoc = await getDoc(preferencesRef);

    if (preferencesDoc.exists()) {
      await updateDoc(preferencesRef, validatedPreferences);
    } else {
      await setDoc(preferencesRef, {
        ...validatedPreferences,
        createdAt: new Date(),
      });
    }

    // Also update the user's main document with basic notification settings
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      notificationsEnabled: validatedPreferences.enablePushNotifications,
      lastPreferencesUpdate: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences: validatedPreferences,
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE reset preferences to default
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

    const preferencesRef = doc(db, 'notificationPreferences', userId);
    await setDoc(preferencesRef, {
      ...defaultPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update user's main document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      notificationsEnabled: true,
      lastPreferencesUpdate: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Notification preferences reset to default',
      preferences: defaultPreferences,
    });
  } catch (error) {
    console.error('Reset preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}