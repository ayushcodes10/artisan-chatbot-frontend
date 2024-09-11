import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
    return (
        <Provider store={store}>  {}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ChatWidget />
            </div>
        </Provider>
    );
};

export default App;
