import { useState } from "react";

export default function ChatWindow({ messages, selectedUser, sendMessage }) {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col h-full bg-gray-100">

      <div className="p-4 bg-white border-b font-bold text-gray-900">
        {selectedUser ? selectedUser.username : "Select a user"}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-xs font-bold text-gray-900 ${
              m.self
                ? "ml-auto bg-green-200"
                : "mr-auto bg-white"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="p-3 flex gap-2 bg-white border-t">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={() => {
              sendMessage(text);
              setText("");
            }}
            className="px-4 bg-blue-600 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      )}

    </div>
  );
}
