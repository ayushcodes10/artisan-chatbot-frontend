import React, { useState, useEffect, useRef } from 'react';
import { createSession, sendMessage, editMessage, deleteMessage } from '../api/chatApi';
import { Button, TextField, IconButton, Box, Typography, Paper } from '@mui/material';
import { Send as SendIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
    // State to store the current session ID
    const [sessionId, setSessionId] = useState<string>('');
    
    // State to store chat messages including user messages, chatbot responses, and suggestions
    const [messages, setMessages] = useState<{ user_message: string, chatbot_response: string, suggestions?: string[] }[]>([]);
    
    // State to manage the input field value
    const [input, setInput] = useState<string>('');
    
    // Ref to keep track of the end of the messages list for scrolling purposes
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize the chat session when the component mounts
    useEffect(() => {
        const initializeSession = async () => {
            try {
                // Create a new session and set the initial message
                const { session_id, message } = await createSession();
                setSessionId(session_id);
                setMessages([{ user_message: '', chatbot_response: message }]);
            } catch (error) {
                console.error('Failed to initialize session', error);
            }
        };

        initializeSession();
    }, []);

    // Scroll to the bottom of the messages list whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to scroll to the bottom of the chat messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Function to handle sending a message
    const handleSendMessage = async () => {
        if (input.trim() === '') return; // Do not send empty messages

        try {
            // Send the user message and update the chat with the response
            const response = await sendMessage(sessionId, input);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    user_message: input,
                    chatbot_response: response.chatbot_response,
                    suggestions: response.suggestions || []
                }
            ]);
            setInput(''); // Clear the input field after sending
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    // Function to handle editing the last message
    const handleEditMessage = async () => {
        if (messages.length === 0) return; // No messages to edit

        const lastMessage = messages[messages.length - 1].user_message;
        try {
            // Edit the last message and update the chat
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

    // Function to handle deleting the last message
    const handleDeleteMessage = async () => {
        if (messages.length === 0) return; // No messages to delete

        try {
            // Delete the last message and update the chat
            await deleteMessage(sessionId);
            setMessages(prevMessages => prevMessages.slice(0, -1));
        } catch (error) {
            console.error('Failed to delete message', error);
        }
    };

    // Function to handle clicking on a suggestion
    const handleSuggestionClick = async (suggestion: string) => {
        try {
            // Send the suggestion as a message and update the chat
            const response = await sendMessage(sessionId, suggestion);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    user_message: suggestion,
                    chatbot_response: response.chatbot_response,
                    suggestions: response.suggestions || []
                }
            ]);
        } catch (error) {
            console.error('Failed to send suggestion', error);
        }
    };

    return (
        <Box className="chat-widget">
            {/* Header of the chat widget */}
            <Box className="widget-header">
                <Box className="chatbot-icon">CB</Box>
                <Typography variant="subtitle1"><p>Hey 👋, I'm Ava</p></Typography>
            </Box>
            {/* Container for chat messages */}
            <Box className="chat-messages">
                {messages.map((msg, index) => (
                    <React.Fragment key={index}>
                        {msg.user_message && (
                            <Box className="message user-message">
                                {index === messages.length - 1 && (
                                    <Box className="edit-delete-buttons">
                                        {/* Edit and delete buttons for the last user message */}
                                        <IconButton className="edit-button" onClick={handleEditMessage}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton className="delete-button" onClick={handleDeleteMessage}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}
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
                                </Paper>
                            </Box>
                        )}
                        {msg.chatbot_response && (
                            <Box className="message chatbot-message">
                                <Box className="chatbot-image">CB</Box> {/* Placeholder for chatbot image */}
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
                                {/* Display suggestions if available */}
                                {msg.suggestions && (
                                    <Box className="suggestions">
                                        {msg.suggestions.map((suggestion, suggestionIndex) => (
                                            <Button 
                                                key={suggestionIndex} 
                                                variant="outlined"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                sx={{ 
                                                    borderColor: '#7d37ff', 
                                                    color: 'black', 
                                                    margin: '2px', 
                                                    borderRadius: '12px', 
                                                    fontSize: 'small' 
                                                }}
                                            >
                                                {suggestion}
                                            </Button>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </React.Fragment>
                ))}
                <div ref={messagesEndRef} /> {/* Ref for scrolling to the bottom */}
            </Box>
            {/* Input area for sending new messages */}
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
