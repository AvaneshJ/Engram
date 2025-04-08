import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import personalityData from "../../Engram/database/Chatbot_aura.json";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [personality, setPersonality] = useState(null);
    const messagesEndRef = useRef(null);

    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        setPersonality(personalityData);

        if (personalityData) {
            setMessages([
                {
                    role: "system",
                    content: generateSystemMessage(personalityData)
                },
                {
                    role: "bot",
                    content: "Hi there!!"
                }
            ]);
        }
    }, []);

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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (input.trim() === "" || !personality) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
                        { role: "user", content: input }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0].message) {
                const botMessage = {
                    role: "bot",
                    content: data.choices[0].message.content
                };
                setMessages((prev) => [...prev, botMessage]);
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: "Oh no, I think I messed up... I'm sorry about this. Could we try again? I just want to make sure I understand you properly.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    if (!personality) {
        return <div>Loading personality...</div>;
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-messages">
                {messages.filter(msg => msg.role !== "system").map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.content}
                    </div>
                ))}
                {loading && <div className="message bot">Let me think about that...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={loading}
                />
                <button onClick={sendMessage} disabled={loading}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;