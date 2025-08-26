import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface NotificationPermissionResult {
  granted: boolean;
  token?: string;
  error?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  data?: Record<string, any>;
}

class NotificationService {
  private static instance: NotificationService;
  private currentToken: string | null = null;
  private listeners: Array<(notification: NotificationData) => void> = [];

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permission and get FCM token
   */
  public async requestPermission(userId?: string): Promise<NotificationPermissionResult> {
    try {
      if (!messaging) {
        return {
          granted: false,
          error: 'Firebase Messaging not supported in this environment. Please check your Firebase configuration.'
        };
      }

      // Check if notifications are supported
      if (!('Notification' in window)) {
        return {
          granted: false,
          error: 'Notifications not supported in this browser'
        };
      }

      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        return {
          granted: false,
          error: 'Notification permission denied'
        };
      }

      // Check if VAPID key is configured
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey || vapidKey === 'your-vapid-key') {
        return {
          granted: false,
          error: 'Firebase VAPID key not configured. Please set NEXT_PUBLIC_FIREBASE_VAPID_KEY in your environment variables.'
        };
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: vapidKey
      });

      if (!token) {
        return {
          granted: false,
          error: 'Failed to get FCM token. Please check your Firebase configuration and ensure the service worker is properly registered.'
        };
      }

      this.currentToken = token;

      // Save token to user's document if userId provided
      if (userId) {
        await this.saveTokenToFirestore(userId, token);
      }

      // Set up foreground message listener
      this.setupForegroundListener();

      return {
        granted: true,
        token
      };
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('messaging/failed-service-worker-registration')) {
          errorMessage = 'Service worker registration failed. Please ensure firebase-messaging-sw.js is properly configured with your Firebase project settings.';
        } else if (error.message.includes('messaging/unsupported-browser')) {
          errorMessage = 'Firebase messaging is not supported in this browser.';
        } else if (error.message.includes('messaging/permission-blocked')) {
          errorMessage = 'Notification permission is blocked. Please enable notifications in your browser settings.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        granted: false,
        error: errorMessage
      };
    }
  }

  /**
   * Save FCM token to Firestore
   */
  private async saveTokenToFirestore(userId: string, token: string): Promise<void> {
    try {
      const userTokenRef = doc(db, 'userTokens', userId);
      const userTokenDoc = await getDoc(userTokenRef);

      const tokenData = {
        token,
        updatedAt: new Date(),
        platform: this.getPlatform(),
        userAgent: navigator.userAgent
      };

      if (userTokenDoc.exists()) {
        await updateDoc(userTokenRef, tokenData);
      } else {
        await setDoc(userTokenRef, {
          ...tokenData,
          createdAt: new Date()
        });
      }

      // Also save to user's main document for easy access
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: token,
        notificationsEnabled: true,
        lastTokenUpdate: new Date()
      });

      console.log('FCM token saved to Firestore');
    } catch (error) {
      console.error('Error saving token to Firestore:', error);
    }
  }

  /**
   * Set up listener for foreground messages
   */
  private setupForegroundListener(): void {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);

      const notification: NotificationData = {
        id: Date.now().toString(),
        title: payload.notification?.title || 'EduGenius',
        body: payload.notification?.body || 'You have a new notification',
        timestamp: Date.now(),
        read: false,
        type: (payload.data?.type as any) || 'info',
        actionUrl: payload.data?.url,
        data: payload.data
      };

      // Notify all listeners
      this.listeners.forEach(listener => listener(notification));

      // Show browser notification if page is not in focus
      if (document.hidden) {
        this.showBrowserNotification(notification);
      }
    });
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notification: NotificationData): void {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/icon1-192.png',
        badge: '/icons/icon1-96.png',
        tag: notification.id,
        requireInteraction: false,
        silent: false
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  /**
   * Add notification listener
   */
  public addNotificationListener(listener: (notification: NotificationData) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove notification listener
   */
  public removeNotificationListener(listener: (notification: NotificationData) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Delete FCM token
   */
  public async deleteToken(userId?: string): Promise<boolean> {
    try {
      if (!messaging || !this.currentToken) {
        return false;
      }

      await deleteToken(messaging);
      
      if (userId) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          fcmToken: null,
          notificationsEnabled: false,
          lastTokenUpdate: new Date()
        });
      }

      this.currentToken = null;
      return true;
    } catch (error) {
      console.error('Error deleting FCM token:', error);
      return false;
    }
  }

  /**
   * Get current token
   */
  public getCurrentToken(): string | null {
    return this.currentToken;
  }

  /**
   * Get platform info
   */
  private getPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile')) return 'mobile';
    if (userAgent.includes('tablet')) return 'tablet';
    return 'desktop';
  }

  /**
   * Check if notifications are supported and enabled
   */
  public isNotificationSupported(): boolean {
    return 'Notification' in window && !!messaging;
  }

  /**
   * Get current notification permission status
   */
  public getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

export default NotificationService;