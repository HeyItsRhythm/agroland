import api from './api';
// import supabase from './supabase';

class SettingsService {
  // Get system settings
  async getSystemSettings() {
    try {
      const response = await api.get('/settings');
      // API returns { success: true, data: ... }
      // Our api interceptor might return just the data payload if we configured it so?
      // In api.js we did `response.data`. So `response` here IS `{ success: true, data: settings }`.;
      return response;
    } catch (error) {
      console.error('Settings API Error:', error);
      return { success: false, error: 'Failed to load system settings' };
    }
  }

  // Update system settings
  async updateSystemSettings(settings) {
    try {
      const response = await api.put('/settings', settings);
      return response;
    } catch (error) {
      console.error('Update Settings Error:', error);
      return { success: false, error: 'Failed to update system settings' };
    }
  }

  // Get default settings
  getDefaultSettings() {
    return {
      approvalRequired: true,
      autoExpireDays: 90,
      maxImagesPerProperty: 10,
      allowedPropertyTypes: ['agricultural', 'residential', 'commercial', 'industrial'],
      featuredPropertiesLimit: 5,
      notifyAdminOnNewProperty: true,
      notifySellerOnApproval: true,
      maintenanceMode: false
    };
  }

  // Ensure table exists (CHECK ONLY)
  async ensureSystemSettingsTable() {
    // No-op for Mongo
    return { success: true };
  }
};

const settingsService = new SettingsService();
export default settingsService;