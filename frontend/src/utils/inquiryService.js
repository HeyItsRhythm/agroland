import api from './api';

class InquiryService {
  // Create a new inquiry
  async createInquiry(inquiryData) {
    try {
      const response = await api.post('/inquiries', inquiryData);
      return response;
    } catch (error) {
      console.error('Exception creating inquiry:', error);
      return { success: false, error: 'Failed to send inquiry' };
    }
  }

  // Get inquiries for a specific seller (received inquiries)
  async getInquiriesForSeller(sellerId) {
    try {
      const response = await api.get(`/inquiries/seller/${sellerId}`);

      // The frontend might expect 'property' and 'sender' populated.
      // Since Mongo aggregate lookup is complex, let's see if frontend breaks.
      // If it breaks, we'll need to fetch related data or update frontend.

      return response;
    } catch (error) {
      console.error('Exception fetching inquiries:', error);
      return { success: false, error: 'Failed to fetch inquiries' };
    }
  }

  // Get inquiries sent by a user (buyer)
  async getInquiriesBySender(senderId) {
    try {
      const response = await api.get(`/inquiries/sender/${senderId}`);
      return response;
    } catch (error) {
      return { success: false, error: 'Failed to fetch sent inquiries' };
    }
  }
  // Update inquiry status or other fields
  async updateInquiry(inquiryId, updates) {
    try {
      const response = await api.put(`/inquiries/${inquiryId}`, updates);
      return response;
    } catch (error) {
      return { success: false, error: 'Failed to update inquiry' };
    }
  }

  // Respond to inquiry
  async respondToInquiry(inquiryId, responseText) {
    try {
      const response = await api.put(`/inquiries/${inquiryId}`, {
        response: responseText,
        status: 'responded',
        updated_at: new Date().toISOString()
      });
      return response;
    } catch (error) {
      return { success: false, error: 'Failed to respond to inquiry' };
    }
  }
}

export default new InquiryService();
