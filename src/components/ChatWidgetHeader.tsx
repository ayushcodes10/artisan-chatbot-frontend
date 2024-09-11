import React from 'react';
import { Box, Typography } from '@mui/material';
import './ChatWidgetHeader.css';

const ChatWidgetHeader: React.FC = () => {
    return (
        <Box className="widget-header">
            <Box className="chatbot-icon">CB</Box>
            <Typography variant="subtitle1"><p>Hey 👋, I'm Ava</p></Typography>
        </Box>
    );
};

export default ChatWidgetHeader;
