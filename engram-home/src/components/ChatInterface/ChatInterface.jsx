// ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatInterface.css';

const ChatInterface = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "assistant" },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const username = "User"; // You can replace this with actual username

  // Auto-scroll to the bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Theme toggle effect
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Hide welcome message on first user message
    if (showWelcome) {
      setShowWelcome(false);
    }

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user"
    };
    
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    
    // Simulate assistant response after a short delay
    setTimeout(() => {
      const assistantResponse = {
        id: messages.length + 2,
        text: "This is a simulated response. Replace this with your actual chat logic.",
        sender: "assistant"
      };
      setMessages(prevMessages => [...prevMessages, assistantResponse]);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([
      { id: 1, text: "Hello! How can I help you today?", sender: "assistant" },
    ]);
    setShowWelcome(true);
  };

  const handleBack = () => {
    navigate('/');  // Navigate to the root path where the main landing page is rendered
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app-container">
      {/* Left navigation panel */}
      <aside className="side-nav">
        <div className="nav-top">
          <button className="nav-button back-button" title="Go back" onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#000" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <button className="nav-button new-chat-button" title="New chat" onClick={handleNewChat}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div className="nav-bottom">
          <button className="user-avatar" title={username}>
            {username.charAt(0)}
          </button>
        </div>
      </aside>

      {/* Main chat container */}
      <div className="chat-container">
        <header className="chat-header">
          <div className="logo">Engram Chat</div>
          <div className="header-buttons">
            <button className="theme-toggle" onClick={toggleTheme} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="home-button" title="Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#000" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </button>
          </div>
        </header>

        <main className="chat-messages">
          {showWelcome && (
            <div className="welcome-message">
              <h1>Hello, Welcome to Engram Chatbot</h1>
              <p>Ask me anything to get started</p>
            </div>
          )}
          
          {!showWelcome && messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === "assistant" ? "assistant-message" : "user-message"}`}
            >
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>

        <footer className="chat-input-area">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message..."
                className="message-input"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button type="submit" className="send-button" disabled={!inputValue.trim()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatInterface;