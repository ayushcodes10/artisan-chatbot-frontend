import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setSessionId, addMessage, updateInput, deleteLastMessage } from '../store/chatSlice';
import { createSession, sendMessage, deleteMessage } from '../api/chatApi';
import { Button, TextField, IconButton, Box } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import Message from './Message';
import ChatWidgetHeader from './ChatWidgetHeader';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { sessionId, messages, input } = useSelector((state: RootState) => state.chat);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                const { session_id, message } = await createSession();
                console.log('Session Initialized:', { session_id, message });
                dispatch(setSessionId(session_id));
                dispatch(addMessage({ user_message: '', chatbot_response: message }));
            } catch (error) {
                console.error('Failed to initialize session', error);
            }
        };
    
        initializeSession();
    }, [dispatch]); 

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
            dispatch(addMessage({
                user_message: input,
                chatbot_response: response.chatbot_response,
                suggestions: response.suggestions || []
            }));
            dispatch(updateInput(''));
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleEditMessage = async () => {
        if (messages.length === 0) return;

        const lastMessageIndex = messages.length - 1;
        const lastMessage = messages[lastMessageIndex].user_message;

        try {
            await deleteMessage(sessionId);
            dispatch(deleteLastMessage());
            dispatch(updateInput(lastMessage));
        } catch (error) {
            console.error('Failed to edit message', error);
        }
    };

    const handleDeleteMessage = async () => {
        if (messages.length === 0) return;

        try {
            await deleteMessage(sessionId);
            dispatch(deleteLastMessage());
        } catch (error) {
            console.error('Failed to delete message', error);
        }
    };

    const handleSuggestionClick = async (suggestion: string) => {
        try {
            const response = await sendMessage(sessionId, suggestion);
            dispatch(addMessage({
                user_message: suggestion,
                chatbot_response: response.chatbot_response,
                suggestions: response.suggestions || []
            }));
        } catch (error) {
            console.error('Failed to send suggestion', error);
        }
    };

    return (
        <Box className="chat-widget">
            <ChatWidgetHeader />
            <Box className="chat-messages">
                {messages.map((msg, index) => (
                    <Message
                        key={index}
                        message={msg}
                        isLatest={index === messages.length - 1}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                        onSuggestionClick={handleSuggestionClick}
                    />
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box className="input-container">
                <Box className="text-box">
                    <TextField
                        value={input}
                        onChange={(e) => dispatch(updateInput(e.target.value))}
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
