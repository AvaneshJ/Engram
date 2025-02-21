import React, { useState, useEffect, useRef } from "react";
import "Chatbot.css";

const Chatbot = () => {
    const [messages, setMessages] = useState<>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const ApiKey = //Api thorugh .env file

        useEffect(() => {
            setMessages([
                {
                    role: "system",
                    content:
                        "TODO: Woopdi woop system messages and json thing"
                }
            ]);
        }, []);

    const sendMessage = async () {
        if (input.trim() === "") return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);


        try {
            //TODO:Api success

        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }
}

export default Chatbot;