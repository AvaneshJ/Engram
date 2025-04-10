import React, { useState, useEffect, useRef } from 'react';
import './ChatInterface.css';
import personalityData from '../../Engram/database/Chatbot_aura.json';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showWelcome, setShowWelcome] = useState(true);
    const [loading, setLoading] = useState(false);
    const [personality, setPersonality] = useState(null);
    const messagesEndRef = useRef(null);
    const username = 'User';
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        setPersonality(personalityData);
        if (personalityData) {
            setMessages([
                {
                    role: 'system',
                    content: generateSystemMessage(personalityData),
                },
                {
                    role: 'bot',
                    content: 'Hi there!!',
                },
            ]);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const generateSystemMessage = (personality) => {
        return `You are a chatbot that embodies the following personality traits:
- Openness: ${personality.Openness.Description}
- Conscientiousness: ${personality.Conscientiousness.Description}
- Extraversion: ${personality.Extraversion.Description}
- Agreeableness: ${personality.Agreeableness.Description}
- Neuroticism: ${personality.Neuroticism.Description}
- Relations: ${personality.Relations.Description}
- Other: ${personality.Other.Description}

Respond to all messages in a way that reflects these personality traits. Be thoughtful, somewhat anxious about social interactions, prefer deep one-on-one conversations, and show concern about what others think. Mention Jene when appropriate.`;
    };

    const sendMessage = async () => {
        if (inputValue.trim() === '' || !personality) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);
        setShowWelcome(false);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [...messages, userMessage].filter((m) => m.role !== 'system'),
                    temperature: 0.7,
                    max_tokens: 150,
                }),
            });

            const data = await response.json();
            if (data.choices && data.choices[0].message) {
                const botMessage = {
                    role: 'bot',
                    content: data.choices[0].message.content,
                };
                setMessages((prev) => [...prev, botMessage]);
            }
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    content:
                        "Oh no, I think I messed up... I'm sorry about this. Could we try again? I just want to make sure I understand you properly.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const handleNewChat = () => {
        if (personality) {
            setMessages([
                {
                    role: 'system',
                    content: generateSystemMessage(personality),
                },
                {
                    role: 'bot',
                    content: 'Hi there!!',
                },
            ]);
            setShowWelcome(true);
        }
    };

    return (
        <div className="app-container">
            <aside className="side-nav">
                <div className="nav-top">
                    <button className="nav-button back-button" title="Go back">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path fill="#000" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                    </button>
                    <button className="nav-button new-chat-button" title="New chat" onClick={handleNewChat}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
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

            <div className="chat-container">
                <header className="chat-header">
                    <div className="logo">Engram Chat</div>
                    <button className="home-button" title="Home">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path fill="#000" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                    </button>
                </header>

                <main className="chat-messages">
                    {showWelcome && (
                        <div className="welcome-message">
                            <h1>Hello, Welcome to Engram Chatbot</h1>
                            <p>Ask me anything to get started</p>
                        </div>
                    )}

                    {!showWelcome &&
                        messages
                            .filter((msg) => msg.role !== 'system')
                            .map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.role === 'bot' ? 'assistant-message' : 'user-message'}`}
                                >
                                    <div className="message-content">{message.content}</div>
                                </div>
                            ))}
                    {loading && (
                        <div className="message assistant-message">
                            <div className="message-content">Let me think about that...</div>
                        </div>
                    )}
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
                                disabled={loading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <button type="submit" className="send-button" disabled={!inputValue.trim() || loading}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
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
