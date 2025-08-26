'use client';

import React, { useEffect, useCallback } from 'react';
import { X, Bell, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NotificationData } from '@/lib/notificationService';

interface NotificationToastProps {
  notification: NotificationData;
  onCloseAction: () => void;
  onActionCallback?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onCloseAction,
  onActionCallback,
  autoClose = true,
  autoCloseDelay = 5000,
  position = 'top-right'
}) => {
  const handleClose = useCallback(() => {
    onCloseAction();
  }, [onCloseAction]);

  const handleAction = useCallback(() => {
    if (onActionCallback) {
      onActionCallback();
    } else if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    handleClose();
  }, [onActionCallback, notification.actionUrl, handleClose]);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, handleClose]);

  const getIcon = (type: NotificationData['type']) => {
    const iconProps = { className: 'h-5 w-5 flex-shrink-0' };
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle {...iconProps} className="h-5 w-5 text-red-500" />;
      default:
        return <Info {...iconProps} className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPositionClasses = (pos: typeof position) => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[pos];
  };

  const getBorderColor = (type: NotificationData['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div
      className={cn(
        'fixed z-50 w-full max-w-sm',
        getPositionClasses(position)
      )}
    >
      <div
        className={cn(
          'bg-background border rounded-lg shadow-lg p-4 border-l-4',
          getBorderColor(notification.type),
          'animate-in slide-in-from-right-full duration-300'
        )}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          {getIcon(notification.type)}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm leading-tight">
                {notification.title}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent opacity-70 hover:opacity-100"
                onClick={handleClose}
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
              {notification.body}
            </p>
            
            {notification.actionUrl && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAction}
                  className="text-xs"
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {autoClose && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-b-lg overflow-hidden">
            <div
              className={cn(
                'h-full bg-primary rounded-b-lg',
                'animate-[shrink_5000ms_linear_forwards]'
              )}
              style={{
                animationDuration: `${autoCloseDelay}ms`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface NotificationToastContainerProps {
  notifications: NotificationData[];
  onCloseAction: (id: string) => void;
  maxToasts?: number;
  position?: NotificationToastProps['position'];
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({
  notifications,
  onCloseAction,
  maxToasts = 3,
  position = 'top-right'
}) => {
  const recentNotifications = notifications.slice(0, maxToasts);

  const handleCloseNotification = useCallback((id: string) => {
    onCloseAction(id);
  }, [onCloseAction]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {recentNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{
            zIndex: 50 + index,
            ...(position.includes('top') ? { top: `${16 + index * 80}px` } : { bottom: `${16 + index * 80}px` }),
            ...(position.includes('right') ? { right: '16px' } : 
                position.includes('left') ? { left: '16px' } : { left: '50%', transform: 'translateX(-50%)' })
          }}
        >
          <NotificationToast
            notification={notification}
            onCloseAction={() => handleCloseNotification(notification.id)}
            position={position}
          />
        </div>
      ))}
    </div>
  );
};