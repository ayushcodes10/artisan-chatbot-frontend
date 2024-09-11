import React from 'react';
import { Button, Box, Typography, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Message as MessageType } from '../store/chatSlice';

interface MessageProps {
    message: MessageType;
    isLatest: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onSuggestionClick: (suggestion: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, isLatest, onEdit, onDelete, onSuggestionClick }) => (
    <React.Fragment>
        {message.user_message && (
            <Box className="message user-message">
                {isLatest && (
                    <Box className="edit-delete-buttons">
                        <IconButton className="edit-button" onClick={onEdit}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton className="delete-button" onClick={onDelete}>
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
                    alignSelf: 'flex-end'
                }}>
                    <Typography variant="body1">{message.user_message}</Typography>
                </Paper>
            </Box>
        )}
        {message.chatbot_response && (
            <Box className="message chatbot-message">
                <Box className="chatbot-image">CB</Box>
                <Paper elevation={3} sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                    color: 'black', 
                    borderRadius: '12px', 
                    padding: '10px', 
                    maxWidth: '70%',
                    position: 'relative',
                    marginLeft: '50px',
                }}>
                    <Typography variant="body1">{message.chatbot_response}</Typography>
                </Paper>
                {isLatest && message.suggestions && (
                    <Box className="suggestions">
                        {message.suggestions.map((suggestion: string, suggestionIndex: number) => (
                            <Button 
                                key={suggestionIndex} 
                                variant="outlined"
                                onClick={() => onSuggestionClick(suggestion)}
                                sx={{ 
                                    borderColor: '#7d37ff', 
                                    color: 'black', 
                                    margin: '2px', 
                                    borderRadius: '12px', 
                                    fontSize: 'small',
                                    '&:disabled': {
                                        color: 'rgba(0, 0, 0, 0.3)',
                                        borderColor: 'rgba(0, 0, 0, 0.3)'
                                    }
                                }}
                                disabled={!isLatest}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </Box>
                )}
            </Box>
        )}
    </React.Fragment>
);

export default Message;
