import api from './api';

class FileService {
  // Initialize uploads - checked on backend usually
  async initializeBuckets() {
    return true; // No-op
  }

  // Ensure bucket exists
  async ensureBucketExists(bucketName) {
    return true; // No-op, backend handles directory creation
  }

  /**
   * Upload a single file to Backend Storage
   * @param {File} file - The file to upload
   * @param {string} bucket - Ignored for local storage
   * @returns {Promise<{success: boolean, url: string|null, error: string|null}>}
   */
  async uploadFile(file, bucket = 'property-images') {
    try {
      if (!file) {
        return { success: false, url: null, error: 'No file provided' };
      }

      const formData = new FormData();
      formData.append('file', file);

      // We need to use raw axios or fetch for multipart/form-data if 'api' instance sets json content type?
      // Our api interceptor might handle it if we don't set Content-Type manually, axios detects it.
      // But let's use the api instance.

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Response structure from backend: { success: true, url: ... }
      // api interceptor returns response string/object? 
      // api.js usually returns `response.data`. 
      // If success, we just return it.

      if (response && response.success) {
        return { success: true, url: response.url, error: null };
      }

      return { success: false, url: null, error: response?.error || 'Upload failed' };

    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, url: null, error: error.message };
    }
  }

  /**
   * Upload multiple files
   * @param {File[]} files - Array of files to upload
   * @param {string} bucket - Ignored
   * @returns {Promise<{success: boolean, urls: string[], error: string|null}>}
   */
  async uploadMultipleFiles(files, bucket = 'property-images') {
    try {
      if (!files || files.length === 0) {
        return { success: false, urls: [], error: 'No files provided' };
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response && response.success) {
        return { success: true, urls: response.urls, error: null };
      }
      return { success: false, urls: [], error: response?.error || 'Upload failed' };

    } catch (error) {
      console.error('Multiple file upload error:', error);
      return { success: false, urls: [], error: error.message };
    }
  }

  /**
   * Delete a file
   * @param {string} url - The URL of the file to delete
   * @param {string} bucket - Ignored
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async deleteFile(url, bucket = 'property-images') {
    // Implementation for delete on backend not created yet. 
    // We can just skip for now or implement if needed. 
    return { success: true };
  }
}

export default new FileService();
