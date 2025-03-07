// components/Chatbot.tsx
"use client";


import RightChatHistory from "@/components/ui/RightChatHistory";
import { useState } from "react";

// import ChatHistory from "@/components/ui/ChatHistory";

// Define the Message type with specific roles
type Message = {
  role: "user" | "bot";
  content: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]); // Use the Message type
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="container">
        <h1 className="title">Chatbot</h1>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={handleChange}
            placeholder="Type a message..."
          />
          <button className="send-button" onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
      <RightChatHistory messages={messages} />
    </div>
  );
};

export default Chatbot;
