import api from './api';
// import { supabase } from './supabase';

class ContactService {
    // Submit a new contact message
    async sendMessage(contactData) {
        try {
            const response = await api.post('/messages', contactData);
            return response;
        } catch (error) {
            console.error('Exception sending message:', error);
            return { success: false, error: 'Failed to send message' };
        }
    }

    // Get all messages (for admin)
    async getAllMessages() {
        try {
            const response = await api.get('/messages');
            return response;
        } catch (error) {
            return { success: false, error: 'Failed to fetch messages' };
        }
    }

    // Mark message as read/replied
    async updateMessageStatus(id, status) {
        try {
            const response = await api.put(`/messages/${id}`, { status });
            return response;
        } catch (error) {
            return { success: false, error: 'Failed to update message' };
        }
    }

    // Delete a message
    async deleteMessage(id) {
        try {
            const response = await api.delete(`/messages/${id}`);
            return response;
        } catch (error) {
            return { success: false, error: 'Failed to delete message' };
        }
    }
}

export default new ContactService();
