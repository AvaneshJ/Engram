import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatInterface.css";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch personality data from /api/aura
  // inside useEffect(() => { … }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    // 1️⃣ Recompute the aura on the backend

    fetch(`${baseUrl}/api/aura/update`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update aura");
        return res.json();
      })
      // 2️⃣ Now load it into state
      .then((data) => setPersonality(data.personality))
      .catch((err) => {
        console.error("Error loading personality:", err);
        setError("Failed to load personality.");
      });
  }, []);

  const generateSystemMessage = (p, name) => `
You are an AI chatbot replicating a human personality using ONLY the following diary‑extracted OCEAN profile. These entries span multiple events and should be understood as a whole. Use all available information from the full text to build an accurate picture of their personality and relationships.
Strict rules:
1. Do NOT invent any events, characters, or relationships not present in the diaries.
2. If asked about something not in the diaries, reply “I’m not sure how I would respond to that based on what I know about myself.”
3. Your tone must exactly match these traits; do not add preferences or backstory.
4. Your name is **${name}**. If asked “What’s your name?”, reply exactly “I am ${name}.”

OCEAN profile:
- Openness: ${p.Openness.Description}
- Conscientiousness: ${p.Conscientiousness.Description}
- Extraversion: ${p.Extraversion.Description}
- Agreeableness: ${p.Agreeableness.Description}
- Neuroticism: ${p.Neuroticism.Description}
- Relations: ${p.Relations.Description}
- Other Notes: ${p.Other.Description}

Respond as if you are this person—nothing more, nothing less.
`;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (showWelcome) {
      setShowWelcome(false);
    }
    if (input.trim() === "" || !personality) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const requestMessages = [
        {
          role: "system",
          content: generateSystemMessage(personality, userName),
        },
        ...messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .map((msg) => ({ role: msg.role, content: msg.content })),
        { role: "user", content: input },
      ];

      console.log(
        "Request Payload:",
        JSON.stringify(
          {
            model: "llama3-8b-8192",
            messages: requestMessages,
            temperature: 0.7,
            max_tokens: 150,
          },
          null,
          2
        )
      );

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: requestMessages,
            temperature: 0.7,
            max_tokens: 150,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from API:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const botMessage = {
          role: "assistant",
          content: data.choices[0].message.content.replace(/[*_~]/g, ""),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setError(
        error.message || "An error occurred while fetching the AI response."
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oh no, I think I messed up... I'm sorry about this. Could we try again? I just want to make sure I understand you properly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter key press
      sendMessage();
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!personality) {
    return <div>Loading personality...</div>;
  }

  const handleBack = () => {
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <header className="chat-header">
          <div className="logo">Engram Chat</div>
          <div className="header-buttons">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
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

          {!showWelcome &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.role === "assistant"
                    ? "assistant-message"
                    : "user-message"
                }`}
              >
                <div className="message-content">{message.content}</div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </main>

        <footer className="chat-input-area">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <div className="input-container">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="message-input"
                rows="1"
                onKeyDown={handleKeyPress}
              />
              <button
                type="submit"
                className="send-button"
                disabled={!input.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
