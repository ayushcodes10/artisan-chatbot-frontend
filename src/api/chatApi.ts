import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const createSession = async () => {
    const response = await axios.post(`${API_URL}/sessions/create`);
    return response.data;
};

export const sendMessage = async (sessionId: string, message: string) => {
    const response = await axios.post(`${API_URL}/messages/post`, { session_id: sessionId, message });
    return response.data;
};

export const editMessage = async (sessionId: string, message: string) => {
    const response = await axios.post(`${API_URL}/edit`, { session_id: sessionId, message });
    return response.data;
};

export const deleteMessage = async (sessionId: string) => {
    await axios.post(`${API_URL}/delete`, { session_id: sessionId });
};
