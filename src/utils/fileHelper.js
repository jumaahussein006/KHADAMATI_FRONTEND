// src/utils/fileHelper.js
// Utility functions for handling file uploads (converting to base64 for localStorage)

/**
 * Read a file and convert it to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 encoded string
 */
export const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            resolve(e.target.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Validate file size (max 5MB)
 * @param {File} file - The file to validate
 * @returns {boolean}
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
    if (!file) return false;
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    return file.size <= maxSize;
};

/**
 * Validate file type (images and PDFs only)
 * @param {File} file - The file to validate  
 * @returns {boolean}
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf']) => {
    if (!file) return false;
    return allowedTypes.includes(file.type);
};
