import api from './api';
import propertyService from './propertyService';

class PropertyViewService {
  // Get viewed properties for a specific user
  async getViewedProperties(userId) {
    if (!userId) return { success: false, data: [] };
    try {
      const response = await api.get(`/properties/viewed/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching viewed properties:', error);
      return { success: false, error: 'Failed to load viewed properties', data: [] };
    }
  }

  // Track a property view
  async trackPropertyView(userId, propertyId) {
    if (!propertyId) return { success: false };
    try {
      // 1. Increment global view count
      await api.post(`/properties/${propertyId}/view`);

      // 2. Track in user history if logged in
      if (userId) {
        await api.post(`/properties/viewed`, { user_id: userId, property_id: propertyId });
      }

      return { success: true };
    } catch (error) {
      console.error('Error tracking view:', error);
      return { success: false, error: 'Failed to track property view' };
    }
  }
}

export default new PropertyViewService();
