import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:8000';

// Function to create a new session
export const createSession = async () => {
    // Send a POST request to create a new session
    const response = await axios.post(`${API_URL}/sessions/create`);
    
    // Return the response data
    return response.data;
};

// Function to send a message to a specific session
export const sendMessage = async (sessionId: string, message: string) => {
    // Send a POST request with the session ID and message to the server
    const response = await axios.post(`${API_URL}/messages/post`, { session_id: sessionId, message });
    
    // Return the response data
    return response.data;
};

// Function to edit an existing message in a session
export const editMessage = async (sessionId: string, message: string) => {
    // Send a POST request to edit the message in the specified session
    const response = await axios.post(`${API_URL}/edit`, { session_id: sessionId, message });
    
    // Return the response data
    return response.data;
};

// Function to delete a message from a session
export const deleteMessage = async (sessionId: string) => {
    // Send a POST request to delete the message from the specified session
    await axios.post(`${API_URL}/delete`, { session_id: sessionId });
};
