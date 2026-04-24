import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const careerService = {
    // Get all active careers (Public)
    getActiveCareers: async () => {
        try {
            const response = await axios.get(`${API_URL}/careers`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching careers:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Get all careers (Admin)
    getAllCareersAdmin: async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(`${API_URL}/careers/admin/all`, config);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching admin careers:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Create career (Admin)
    createCareer: async (careerData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.post(`${API_URL}/careers`, careerData, config);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating career:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Update career (Admin)
    updateCareer: async (id, careerData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.put(`${API_URL}/careers/${id}`, careerData, config);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error updating career:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Delete career (Admin)
    deleteCareer: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.delete(`${API_URL}/careers/${id}`, config);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error deleting career:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    }
};

export default careerService;
