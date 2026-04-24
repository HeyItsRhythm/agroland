import api from './api';
// import { supabase } from './supabase';

const pressReleaseService = {
    // Get all published press releases
    async getPublishedPressReleases() {
        try {
            const response = await api.get('/press-releases');
            return response;
        } catch (error) {
            console.error('Error fetching press releases:', error);
            return { success: false, error: error.message };
        }
    },

    // Get all press releases (admin only)
    async getAllPressReleases() {
        try {
            const response = await api.get('/press-releases/all');
            return response;
        } catch (error) {
            console.error('Error fetching all press releases:', error);
            return { success: false, error: error.message };
        }
    },

    // Get single press release by ID
    async getPressReleaseById(id) {
        try {
            const response = await api.get(`/press-releases/${id}`);
            return response;
        } catch (error) {
            console.error('Error fetching press release:', error);
            return { success: false, error: error.message };
        }
    },

    // Create new press release (admin only)
    async createPressRelease(pressReleaseData) {
        try {
            const response = await api.post('/press-releases', pressReleaseData);
            return response;
        } catch (error) {
            console.error('Error creating press release:', error);
            return { success: false, error: error.message };
        }
    },

    // Update press release (admin only)
    async updatePressRelease(id, updates) {
        try {
            const response = await api.put(`/press-releases/${id}`, updates);
            return response;
        } catch (error) {
            console.error('Error updating press release:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete press release (admin only)
    async deletePressRelease(id) {
        try {
            const response = await api.delete(`/press-releases/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting press release:', error);
            return { success: false, error: error.message };
        }
    },

    // Toggle publish status
    async togglePublishStatus(id, isPublished) {
        try {
            const response = await api.put(`/press-releases/${id}`, { is_published: isPublished });
            return response;
        } catch (error) {
            console.error('Error toggling publish status:', error);
            return { success: false, error: error.message };
        }
    }
};

export default pressReleaseService;
