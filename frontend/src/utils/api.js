import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Use relative path to work with Vite proxy - This is more reliable than localhost:5000 when accessing from different IPs
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Helper to recursively map _id to id
const mapId = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(mapId);

    const newObj = { ...obj };
    if (newObj._id && !newObj.id) {
        newObj.id = newObj._id.toString();
    }

    // Recursively map nested objects
    Object.keys(newObj).forEach(key => {
        newObj[key] = mapId(newObj[key]);
    });

    return newObj;
};

// Add a response interceptor to handle standard error formats
api.interceptors.response.use(
    (response) => {
        const data = response.data;
        if (data && typeof data === 'object') {
            return mapId(data);
        }
        return data;
    },
    (error) => {
        // Standardize error handling
        const customError = {
            success: false,
            message: error.response?.data?.error || error.message || 'Something went wrong',
            status: error.response?.status,
            data: error.response?.data
        };
        return Promise.reject(customError);
    }
);

export default api;
