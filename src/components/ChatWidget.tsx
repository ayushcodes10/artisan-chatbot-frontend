import React, { useState, useEffect, useRef } from 'react';
import { createSession, sendMessage, editMessage, deleteMessage } from '../api/chatApi';
import { Button, TextField, IconButton, Box, Typography, Paper } from '@mui/material';
import { Send as SendIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
    const [sessionId, setSessionId] = useState<string>('');
    const [messages, setMessages] = useState<{ user_message: string, chatbot_response: string, suggestions?: { sid: string, suggestion_text: string }[] }[]>([]);
    const [input, setInput] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                const { session_id, message } = await createSession();
                setSessionId(session_id);
                setMessages([{ user_message: '', chatbot_response: message }]);
            } catch (error) {
                console.error('Failed to initialize session', error);
            }
        };

        initializeSession();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        try {
            const response = await sendMessage(sessionId, input);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    user_message: input,
                    chatbot_response: response.chatbot_response,
                    suggestions: response.suggestions
                }
            ]);
            setInput('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleEditMessage = async () => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1].user_message;
        try {
            const response = await editMessage(sessionId, lastMessage);
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = { ...updatedMessages[updatedMessages.length - 1], ...response };
                return updatedMessages;
            });
        } catch (error) {
            console.error('Failed to edit message', error);
        }
    };

    const handleDeleteMessage = async () => {
        if (messages.length === 0) return;

        try {
            await deleteMessage(sessionId);
            setMessages(prevMessages => prevMessages.slice(0, -2));
        } catch (error) {
            console.error('Failed to delete message', error);
        }
    };

    const handleSuggestionClick = async (suggestion: string) => {
        try {
            const response = await sendMessage(sessionId, suggestion);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    user_message: suggestion,
                    chatbot_response: response.chatbot_response,
                    suggestions: response.suggestions
                }
            ]);
        } catch (error) {
            console.error('Failed to send suggestion', error);
        }
    };

    return (
        <Box className="chat-widget">
            <Box className="widget-header">
                <Box className="chatbot-icon">CB</Box>
                <Typography variant="subtitle1">Chatbot</Typography>
            </Box>
            <Box className="chat-messages">
                {messages.map((msg, index) => (
                    <React.Fragment key={index}>
                        {msg.user_message && (
                            <Box className="message user-message">
                                <Paper elevation={3} sx={{ 
                                    backgroundColor: '#7d37ff', 
                                    color: 'white', 
                                    borderRadius: '12px', 
                                    padding: '10px', 
                                    maxWidth: '70%', 
                                    position: 'relative',
                                    alignSelf: 'flex-end'  // Ensure message is aligned to the right
                                }}>
                                    <Typography variant="body1">{msg.user_message}</Typography>
                                    {index === messages.length - 1 && (
                                        <Box className="edit-delete-buttons">
                                            <IconButton className="edit-button" onClick={handleEditMessage}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton className="delete-button" onClick={handleDeleteMessage}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        )}
                        {msg.chatbot_response && (
                            <Box className="message chatbot-message">
                                <Box className="chatbot-image">CB</Box> {/* Placeholder for image */}
                                <Paper elevation={3} sx={{ 
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                                    color: 'black', 
                                    borderRadius: '12px', 
                                    padding: '10px', 
                                    maxWidth: '70%',
                                    position: 'relative',
                                    marginLeft: '50px',  // Adjust margin to align with the image
                                }}>
                                    <Typography variant="body1">{msg.chatbot_response}</Typography>
                                </Paper>
                                {msg.suggestions && (
                                    <Box className="suggestions">
                                        {msg.suggestions.map(suggestion => (
                                            <Button 
                                                key={suggestion.sid} 
                                                variant="outlined"
                                                onClick={() => handleSuggestionClick(suggestion.suggestion_text)}
                                                sx={{ 
                                                    borderColor: '#7d37ff', 
                                                    color: 'black', 
                                                    margin: '2px', 
                                                    borderRadius: '12px', 
                                                    fontSize: 'small' 
                                                }}
                                            >
                                                {suggestion.suggestion_text}
                                            </Button>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </React.Fragment>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box className="input-container">
                <Box className="text-box">
                    <TextField
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ 
                            flex: 1, 
                            height: '40px', 
                            minWidth: '200px',
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                '& fieldset': {
                                    borderColor: '#ddd'
                                }
                            },
                            '&:hover .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#aaa'
                                }
                            }
                        }}
                    />
                    <IconButton onClick={handleSendMessage} sx={{ 
                        backgroundColor: '#7d37ff', 
                        color: 'white', 
                        marginLeft: '10px' 
                    }}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatWidget;
