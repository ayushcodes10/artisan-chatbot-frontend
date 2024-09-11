import axios from 'axios';

// Base URL for the API
// const API_URL = 'http://localhost:8000';
const API_URL = 'https://107.22.158.80';

// Define types for API responses
interface CreateSessionResponse {
    session_id: string;
    message: string;
}

interface SendMessageResponse {
    user_message: string;
    chatbot_response: string;
    suggestions?: string[];
}

interface EditMessageResponse {
    success: boolean;
}

// Function to create a new session
export const createSession = async (): Promise<CreateSessionResponse> => {
    try {
        const response = await axios.post<CreateSessionResponse>(`${API_URL}/sessions/create`);
        return response.data;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error; 
    }
};

// Function to send a message to a specific session
export const sendMessage = async (sessionId: string, message: string): Promise<SendMessageResponse> => {
    try {
        const response = await axios.post<SendMessageResponse>(`${API_URL}/messages/post`, { session_id: sessionId, message });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Function to edit an existing message in a session
export const editMessage = async (sessionId: string, newMessage: string): Promise<EditMessageResponse> => {
    try {
        const response = await axios.put<EditMessageResponse>(`${API_URL}/messages/edit`, { session_id: sessionId, new_message: newMessage });
        return response.data;
    } catch (error) {
        console.error('Error editing message:', error);
        throw error;
    }
};

// Function to delete a message from a session
export const deleteMessage = async (sessionId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/messages/delete`, { params: { session_id: sessionId } });
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
};

