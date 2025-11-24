import { useState } from "react";

export default function ChatWindow({ messages, selectedUser, sendMessage }) {
  const [text, setText] = useState("");

  const send = () => {
    sendMessage(text);
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Header */}
      <div className="bg-white shadow p-4 border-b">
        <h2 className="font-bold text-lg text-gray-900">
          {selectedUser ? selectedUser.name : "Select a user"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {!selectedUser ? (
          <p className="text-center text-gray-500">Start chatting...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg w-fit ${
                msg.self
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-300"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input box */}
      {selectedUser && (
        <div className="p-4 bg-white border-t flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 border p-2 rounded-lg text-black"
          />
          <button
            onClick={send}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
