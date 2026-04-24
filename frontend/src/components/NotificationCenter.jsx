import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../utils/notificationService';
import Icon from './AppIcon';

// For development/demo purposes only
const MOCK_NOTIFICATIONS = [
  {
    id: 'mock-1',
    type: 'inquiry',
    title: 'New Inquiry Response',
    message: 'A seller has responded to your inquiry about Farm Land in Ahmedabad',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: 'mock-2',
    type: 'saved',
    title: 'Property Saved',
    message: 'You saved "10 Acre Agricultural Land in Vadodara" to your favorites',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true
  },
  {
    id: 'mock-3',
    type: 'view',
    title: 'Property Update',
    message: 'Price reduced on a property you viewed recently',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  }
];

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    // Only proceed if user is authenticated
    if (!user?.id) {
      // For development/demo purposes, load mock notifications
      if (process.env.NODE_ENV === 'development') {
        setNotifications(MOCK_NOTIFICATIONS);
        setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.read).length);
      }
      return;
    }

    // Load notifications from service
    const loadNotifications = async () => {
      try {
        const result = await notificationService.getNotifications(user.id);
        if (result.success) {
          const notificationData = result.data || [];
          setNotifications(notificationData);
          setUnreadCount(notificationData.filter(n => !n.read).length);
        } else if (process.env.NODE_ENV === 'development') {
          // Fall back to mock data if no notifications found
          setNotifications(MOCK_NOTIFICATIONS);
          setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        // Fall back to mock data in case of error
        if (process.env.NODE_ENV === 'development') {
          setNotifications(MOCK_NOTIFICATIONS);
          setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.read).length);
        }
      }
    };

    loadNotifications();

    try {
      // Subscribe to new notifications from database
      const notificationsSubscription = notificationService.subscribeToNotifications(user.id, async (payload) => {
        if (payload.eventType === 'INSERT') {
          // Reload notifications when new one is added
          const reloadResult = await notificationService.getNotifications(user.id);
          if (reloadResult.success) {
            setNotifications(reloadResult.data || []);
            setUnreadCount((reloadResult.data || []).filter(n => !n.read).length);
          }
        }
      });

      // Subscribe to inquiries for real-time notifications
      const inquirySubscription = notificationService.subscribeToInquiries(user.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          // A new inquiry was created
          addNotification({
            user_id: user.id,
            id: `inquiry-${Date.now()}`,
            type: 'inquiry',
            title: 'New Inquiry Response',
            message: 'A seller has responded to your inquiry',
            timestamp: new Date(),
            read: false
          });
        } else if (payload.eventType === 'UPDATE') {
          // An inquiry was updated
          addNotification({
            user_id: user.id,
            id: `inquiry-update-${Date.now()}`,
            type: 'inquiry',
            title: 'Inquiry Updated',
            message: 'Your inquiry status has been updated',
            timestamp: new Date(),
            read: false
          });
        }
      });

      // Subscribe to saved properties for real-time notifications
      const savedPropertiesSubscription = notificationService.subscribeToSavedProperties(user.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          // A new property was saved
          addNotification({
            user_id: user.id,
            id: `saved-${Date.now()}`,
            type: 'saved',
            title: 'Property Saved',
            message: 'A property has been added to your saved list',
            timestamp: new Date(),
            read: false
          });
        }
      });

      // Clean up subscriptions when component unmounts
      return () => {
        notificationService.unsubscribeFromNotifications(user.id);
        notificationService.unsubscribeFromInquiries(user.id);
        notificationService.unsubscribeFromSavedProperties(user.id);
      };
    } catch (error) {
      console.error('Error setting up notification subscriptions:', error);
      // Fall back to mock data in case of error
      if (notifications.length === 0 && process.env.NODE_ENV === 'development') {
        setNotifications(MOCK_NOTIFICATIONS);
        setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.read).length);
      }
    }
  }, [user]);

  const addNotification = async (notification) => {
    try {
      const result = await notificationService.addNotification(notification);
      if (result.success) {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show notification popup
        showNotificationPopup(notification);
      } else {
        console.error('Error adding notification:', result.error);
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const showNotificationPopup = (notification) => {
    // Create a temporary popup notification that disappears after a few seconds
    const popup = document.createElement('div');
    popup.className = 'fixed top-4 right-4 bg-card border border-border rounded-lg shadow-elevation-2 p-4 z-50 animate-slide-in-right';
    popup.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="bg-primary/10 text-primary p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div>
          <h4 class="font-medium text-foreground">${notification.title}</h4>
          <p class="text-sm text-muted-foreground">${notification.message}</p>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    // Remove popup after 5 seconds
    setTimeout(() => {
      popup.classList.add('animate-slide-out-right');
      setTimeout(() => {
        document.body.removeChild(popup);
      }, 300);
    }, 5000);
  };

  const clearAllNotifications = async () => {
    if (!user?.id) return;

    try {
      const result = await notificationService.clearAll(user.id);
      if (result.success) {
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.error('Error clearing notifications:', result.error);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const result = await notificationService.markAllAsRead(user.id);
      if (result.success) {
        // Update local state
        setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        setUnreadCount(0);

        // Reload notifications to ensure sync with database
        const reloadResult = await notificationService.getNotifications(user.id);
        if (reloadResult.success) {
          setNotifications(reloadResult.data || []);
          setUnreadCount(0);
        }
      } else {
        console.error('Error marking all notifications as read:', result.error);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const markAsRead = async (id) => {
    if (!user?.id) return;

    try {
      const result = await notificationService.markAsRead(id, user.id);
      if (result.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Error marking notification as read:', result.error);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleNotificationCenter = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // Only mark all as read when opening the panel
    if (newIsOpen && user?.id) {
      // Mark all as read when opening
      await markAllAsRead();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'inquiry':
        return 'MessageSquare';
      case 'saved':
        return 'Heart';
      case 'view':
        return 'Eye';
      default:
        return 'Bell';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Bell */}
      <button
        onClick={toggleNotificationCenter}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-elevation-3 z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">Notifications</h3>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
                <span className="text-border">|</span>
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-destructive hover:underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Bell" size={24} className="text-muted-foreground" />
                </div>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10 text-primary'}`}>
                        <Icon name={getNotificationIcon(notification.type)} size={16} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;