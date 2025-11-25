export default function ChatList({ users, selectedUser, openChat }) {
  return (
    <div className="h-full flex flex-col bg-white">

      <h2 className="p-4 font-bold text-lg border-b">Users</h2>

      <div className="flex-1 overflow-y-auto">
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => openChat(u)}
            className={`p-4 cursor-pointer border-b 
              ${selectedUser?._id === u._id ? "bg-gray-200" : "hover:bg-gray-100"}
            `}
          >
            {u.username}
          </div>
        ))}
      </div>

    </div>
  );
}
