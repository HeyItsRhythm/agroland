import api from './api';

class NotificationService {
  constructor() {
    this.subscriptions = {};
    this.notifications = [];
  }

  // Subscribe methods - Mocked for now since we removed real-time
  subscribeToInquiries(userId, callback) { return { unsubscribe: () => { } }; }
  unsubscribeFromInquiries(userId) { return true; }
  subscribeToSavedProperties(userId, callback) { return { unsubscribe: () => { } }; }
  unsubscribeFromSavedProperties(userId) { return true; }
  subscribeToPropertyViews(callback) { return { unsubscribe: () => { } }; }
  unsubscribeFromPropertyViews() { return true; }
  unsubscribeAll() { this.subscriptions = {}; }

  // Get all notifications for a user
  async getNotifications(userId) {
    if (!userId) return { success: false, error: 'User ID is required' };

    try {
      const response = await api.get(`/notifications/user/${userId}`);

      if (response && response.success) {
        // data is in response.data
        // Transform if needed? The backend returns exactly what we store usually.
        // Frontend expects: id, type, title, message, timestamp, read, data
        const notifications = response.data.map(n => ({
          id: n._id, // Mongo ID
          type: n.type,
          title: n.title,
          message: n.message,
          timestamp: new Date(n.created_at),
          read: n.read,
          data: n.data || {}
        }));
        return { success: true, data: notifications };
      }
      return { success: false, error: 'Failed to load notifications' };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, error: 'Failed to load notifications' };
    }
  }

  // Add a notification
  async addNotification(notification) {
    try {
      const response = await api.post('/notifications', notification);
      return response;
    } catch (error) {
      console.error('Error adding notification:', error);
      this.notifications.unshift(notification); // Fallback local
      return { success: true };
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId, userId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: true }; // Optimistic
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const response = await api.put(`/notifications/user/${userId}/read-all`);
      return response;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: true };
    }
  }

  // Clear all notifications for a user
  async clearAll(userId) {
    if (!userId) return { success: false, error: 'User ID is required' };
    try {
      const response = await api.delete(`/notifications/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return { success: false, error: 'Failed to clear notifications' };
    }
  }

  subscribeToNotifications(userId, callback) { return { unsubscribe: () => { } }; }
  unsubscribeFromNotifications(userId) { return true; }
}

export default new NotificationService();
