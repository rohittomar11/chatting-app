import React, { memo } from "react";

function ChatList({ users, selectedUser, openChat }) {
  const formatLastSeen = (time) => {
    if (!time) return "Last seen recently";

    const date = new Date(time);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <h2 className="p-4 font-bold text-lg border-b text-black">Users</h2>

      <div className="flex-1 overflow-y-auto">
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => openChat(u)}
            className={`p-4 cursor-pointer border-b ${
              selectedUser?._id === u._id
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-black">{u.name}</span>

              {u.isOnline ? (
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              ) : (
                <span className="text-xs text-gray-500">
                  {formatLastSeen(u.lastSeen)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ChatList);
