import React from 'react'

const RightChatHistory: React.FC<ChatHistoryProps> = ({ messages })=> {
  return (
	<div className="chat-history">
      <h2>Chat History</h2>
      <div className="history-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`history-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};


export default RightChatHistory