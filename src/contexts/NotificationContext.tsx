'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import NotificationService, { NotificationData } from '@/lib/notificationService';

interface NotificationState {
  notifications: NotificationData[];
  unreadCount: number;
  isPermissionGranted: boolean;
  isLoading: boolean;
  fcmToken: string | null;
}

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PERMISSION'; payload: boolean }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationData }
  | { type: 'SET_NOTIFICATIONS'; payload: NotificationData[] }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

interface NotificationContextType extends NotificationState {
  requestPermission: () => Promise<boolean>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  sendNotification: (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  disableNotifications: () => Promise<void>;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isPermissionGranted: false,
  isLoading: true,
  fcmToken: null,
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_PERMISSION':
      return { ...state, isPermissionGranted: action.payload };
    
    case 'SET_TOKEN':
      return { ...state, fcmToken: action.payload };
    
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.read).length,
      };
    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
      };
    
    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, read: true }
          : notification
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length,
      };
    
    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };
    
    case 'DELETE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.read).length,
      };
    
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    
    default:
      return state;
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [user] = useAuthState(auth);
  const notificationService = NotificationService.getInstance();

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    const initializeNotifications = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Check current permission status
      const permissionStatus = notificationService.getPermissionStatus();
      dispatch({ type: 'SET_PERMISSION', payload: permissionStatus === 'granted' });

      // Get current token if permission is granted
      if (permissionStatus === 'granted') {
        const currentToken = notificationService.getCurrentToken();
        dispatch({ type: 'SET_TOKEN', payload: currentToken });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeNotifications();
  }, [user, notificationService]);

  // Set up real-time listener for notifications
  useEffect(() => {
    if (!user) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const notifications: NotificationData[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          notifications.push({
            id: doc.id,
            title: data.title,
            body: data.body,
            timestamp: data.timestamp?.toMillis() || Date.now(),
            read: data.read || false,
            type: data.type || 'info',
            actionUrl: data.actionUrl,
            data: data.data,
          });
        });
        
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      },
      (error) => {
        console.warn('Notification listener error:', error);
        
        // If it's an index error, fall back to a simpler query
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
          console.log('Index missing for notifications. Using fallback query without ordering.');
          
          // Fallback: Query without orderBy to avoid index requirement
          const fallbackQuery = query(
            notificationsRef,
            where('userId', '==', user.uid)
          );
          
          const fallbackUnsubscribe = onSnapshot(fallbackQuery, (snapshot) => {
            const notifications: NotificationData[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              notifications.push({
                id: doc.id,
                title: data.title,
                body: data.body,
                timestamp: data.timestamp?.toMillis() || Date.now(),
                read: data.read || false,
                type: data.type || 'info',
                actionUrl: data.actionUrl,
                data: data.data,
              });
            });
            
            // Sort manually since we can't use orderBy
            notifications.sort((a, b) => b.timestamp - a.timestamp);
            
            dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
          });
          
          return () => fallbackUnsubscribe();
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Set up foreground notification listener
  useEffect(() => {
    const handleForegroundNotification = (notification: NotificationData) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      
      // Save to Firestore for persistence
      if (user) {
        saveNotificationToFirestore(notification);
      }
    };

    notificationService.addNotificationListener(handleForegroundNotification);

    return () => {
      notificationService.removeNotificationListener(handleForegroundNotification);
    };
  }, [user, notificationService]);

  const saveNotificationToFirestore = async (notification: NotificationData) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        userId: user.uid,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error saving notification to Firestore:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!user) return false;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const result = await notificationService.requestPermission(user.uid);
      
      dispatch({ type: 'SET_PERMISSION', payload: result.granted });
      if (result.token) {
        dispatch({ type: 'SET_TOKEN', payload: result.token });
      }

      return result.granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markAsRead = async (notificationId: string): Promise<void> => {
    if (!user) return;

    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      state.notifications
        .filter(n => !n.read)
        .forEach(n => {
          const notificationRef = doc(db, 'notifications', n.id);
          batch.update(notificationRef, { read: true });
        });
      await batch.commit();
      
      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async (): Promise<void> => {
    if (!user) return;

    try {
      const promises = state.notifications.map(n => 
        deleteDoc(doc(db, 'notifications', n.id))
      );
      await Promise.all(promises);
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  const sendNotification = async (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): Promise<void> => {
    if (!user) return;

    const fullNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };

    await saveNotificationToFirestore(fullNotification);
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
  };

  const disableNotifications = async (): Promise<void> => {
    if (!user) return;

    try {
      await notificationService.deleteToken(user.uid);
      dispatch({ type: 'SET_PERMISSION', payload: false });
      dispatch({ type: 'SET_TOKEN', payload: null });
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  };

  const contextValue: NotificationContextType = {
    ...state,
    requestPermission,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    sendNotification,
    disableNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};