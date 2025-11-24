export default function ChatList({ users, selectedUser, openChat }) {
  return (
    <div className="w-1/4 bg-white shadow p-4 border-r overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => openChat(u)}
          className={`p-3 rounded-lg cursor-pointer mb-2 ${
            selectedUser?._id === u._id
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <span className="font-semibold text-gray-900">{u.name}</span>
        </div>
      ))}
    </div>
  );
}
