import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  user_message: string;
  chatbot_response: string;
  suggestions?: string[];
}

interface ChatState {
  sessionId: string;
  messages: Message[];
  input: string;
}

const initialState: ChatState = {
  sessionId: '',
  messages: [],
  input: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    updateInput(state, action: PayloadAction<string>) {
      state.input = action.payload;
    },
    deleteLastMessage(state) {
      state.messages.pop();
    },
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
  },
});

export const {setSessionId, addMessage, updateInput, deleteLastMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
