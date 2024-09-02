import React from 'react';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ChatWidget />
        </div>
    );
};

export default App;
