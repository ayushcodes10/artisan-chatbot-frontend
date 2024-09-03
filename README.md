# Chat Widget Frontend

## Overview

This project implements the frontend for a chat widget using React. The chat widget allows users to interact with a chatbot, send messages, and receive responses. It also supports editing and deleting messages and displays suggestions provided by the chatbot.

## Components

### ChatWidget Component

- **Function**: The main component of the chat widget responsible for handling user interactions, displaying messages, and managing suggestions.
- **Features**:
  - Displays user and chatbot messages.
  - Allows editing and deleting of the latest user message.
  - Shows suggestions provided by the chatbot.
  - Autoscrolls to the latest message.

### Styling

- **CSS**: Custom styles for the chat widget, including the layout of messages, suggestions, and buttons.

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

### Setup

1. **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd chat-widget-frontend
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Run the Development Server**
    ```bash
    npm start
    ```
   The frontend will be available at `http://localhost:3000`.

## Usage

1. **Open the Chat Widget**: Navigate to the frontend URL to view the chat widget.
2. **Send a Message**: Type your message in the text box and click the send button.
3. **Receive Suggestions**: The chatbot may provide suggestions based on the message.
4. **Edit/Delete Messages**: Use the edit and delete buttons (visible only on the last message) to modify or remove your last message.

## Project Structure

- **`src/`**: Contains React components, API integration, and styles.
  - **`ChatWidget.tsx`**: Main component for the chat widget.
  - **`ChatWidget.css`**: Styles for the chat widget.