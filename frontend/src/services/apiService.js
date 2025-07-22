import axios from 'axios';

// The URL of your backend server
const API_URL = 'http://localhost:5001/api/extract';

export const postImageForExtraction = async (base64ImageData) => {
    try {
        const response = await axios.post(API_URL, {
            imageData: base64ImageData,
        });
        return response.data;
    } catch (error) {
        // Rethrow a more user-friendly error message
        const errorMessage = error.response?.data?.message || "An unexpected error occurred on the server.";
        throw new Error(errorMessage);
    }
};