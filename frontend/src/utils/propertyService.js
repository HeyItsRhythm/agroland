import api from './api';
// import { supabase } from './supabase'; // Deprecated

class PropertyService {
  // Get all properties with optional filtering
  async getProperties(filters = {}) {
    try {
      // Convert filters to query string parameters matching backend expectations
      const params = {};

      if (filters?.property_type) params.property_type = filters.property_type;
      if (filters?.min_price) params.min_price = filters.min_price;
      if (filters?.max_price) params.max_price = filters.max_price;
      if (filters?.location_district) params.location_district = filters.location_district;
      if (filters?.search) params.search = filters.search;
      if (filters?.sort_by) {
        params.sort_by = filters.sort_by;
        params.sort_order = filters.sort_order;
      }
      if (filters?.limit) {
        params.limit = filters.limit;
      }
      // Note: "includeAll" logic for status handling should be passed if needed, 
      // or backend default used. Backend defaults to filtering?
      // Our backend implementation checks for status param. 
      if (!filters?.includeAll) {
        params.status = 'active';
      } else if (filters?.status) {
        params.status = filters.status;
      }

      const response = await api.get('/properties', { params });
      // api interceptor returns response.data which is { success: true, data: [...] }
      // But we handled response.data in interceptor?? 
      // In api.js: user returns response.data. 
      // So here 'response' is the actual body: { success: true, data: ... }

      return response;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message || 'Failed to load properties' };
    }
  }

  // Get a single property by ID
  async getPropertyById(id) {
    try {
      const response = await api.get(`/properties/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching property:', error);
      return { success: false, error: 'Failed to fetch property details' };
    }
  }

  // Get analytics for a specific seller
  async getSellerAnalytics(sellerId) {
    try {
      const response = await api.get(`/properties/seller-analytics/${sellerId}`);
      return response;
    } catch (error) {
      console.error('Seller analytics error:', error);
      return { success: false, error: 'Failed to load seller analytics' };
    }
  }

  // Get analytics for a specific buyer
  async getBuyerAnalytics(buyerId) {
    try {
      const response = await api.get(`/properties/buyer-analytics/${buyerId}`);
      return response;
    } catch (error) {
      console.error('Buyer analytics error:', error);
      return { success: false, error: 'Failed to load buyer analytics' };
    }
  }

  // Get analytics for system (Admin)
  async getPropertyAnalytics() {
    try {
      const response = await api.get('/properties/analytics');
      return response;
    } catch (error) {
      console.error('Analytics error:', error);
      return { success: false, error: 'Failed to load system analytics' };
    }
  }

  // Get general statistics for public landing page
  async getPublicStats() {
    try {
      const response = await api.get('/properties/public-stats');
      return response;
    } catch (error) {
      console.error('Public stats error:', error);
      return { success: false, error: 'Failed to load portal statistics' };
    }
  }

  // Create a new property
  async createProperty(propertyData) {
    try {
      const response = await api.post('/properties', propertyData);
      return response;
    } catch (error) {
      console.error('Error creating property:', error);
      return { success: false, error: 'Failed to create property' };
    }
  }

  // Get properties by seller ID
  async getPropertiesBySeller(sellerId) {
    try {
      // Backend should support filtering by seller_id
      const response = await api.get(`/properties?seller_id=${sellerId}`);
      return response;
    } catch (error) {
      console.error('Error fetching seller properties:', error);
      return { success: false, error: 'Failed to fetch seller properties' };
    }
  }

  // Update a property
  async updateProperty(propertyId, updates) {
    try {
      const response = await api.put(`/properties/${propertyId}`, updates);
      return response;
    } catch (error) {
      console.error('Error updating property:', error);
      return { success: false, error: 'Failed to update property' };
    }
  }

  // Delete a property
  async deleteProperty(propertyId) {
    try {
      const response = await api.delete(`/properties/${propertyId}`);
      return response;
    } catch (error) {
      console.error('Error deleting property:', error);
      return { success: false, error: 'Failed to delete property' };
    }
  }

  // Get properties pending approval (Admin only)
  async getPendingApprovalProperties() {
    try {
      const response = await api.get('/properties?status=pending_approval');
      return response;
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      return { success: false, error: 'Failed to fetch pending properties' };
    }
  }

  // Approve a property (Admin only)
  async approveProperty(propertyId) {
    try {
      const response = await api.put(`/properties/${propertyId}`, { status: 'active' });
      return response;
    } catch (error) {
      console.error('Error approving property:', error);
      return { success: false, error: 'Failed to approve property' };
    }
  }

  // Reject a property (Admin only)
  async rejectProperty(propertyId, reason) {
    try {
      const response = await api.put(`/properties/${propertyId}`, { status: 'rejected', rejection_reason: reason });
      return response;
    } catch (error) {
      console.error('Error rejecting property:', error);
      return { success: false, error: 'Failed to reject property' };
    }
  }

  // Get saved properties for a user
  async getSavedProperties(userId) {
    try {
      // Assuming backend has /api/properties/saved?user_id=...
      const response = await api.get(`/properties/saved/${userId}`);
      if (response.success) return response.data;
      return [];
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      return [];
    }
  }

  // Save a property
  async saveProperty(userId, propertyId) {
    try {
      const response = await api.post(`/properties/saved`, { user_id: userId, property_id: propertyId });
      return response;
    } catch (error) {
      console.error('Error saving property:', error);
      return { success: false, error: error.message };
    }
  }

  // Remove a saved property
  async removeSavedProperty(userId, propertyId) {
    try {
      const response = await api.delete(`/properties/saved?user_id=${userId}&property_id=${propertyId}`);
      return response;
    } catch (error) {
      console.error('Error removing saved property:', error);
      return { success: false, error: error.message };
    }
  }

  // Increment property views
  async incrementPropertyViews(propertyId) {
    try {
      const response = await api.post(`/properties/${propertyId}/view`);
      return response;
    } catch (error) {
      console.error('Error incrementing views:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new PropertyService();