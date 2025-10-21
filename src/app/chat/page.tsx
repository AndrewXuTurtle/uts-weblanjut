"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  id?: number;
  username: string;
  isi: string;
  waktu?: string;
}

export default function ChatPage() {
  const [username, setUsername] = useState("");
  const [pesan, setPesan] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    setIsConnecting(true);

    // Get current host dynamically for network access
    const currentHost = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
    const socketUrl = `http://${currentHost}`;

    // Initialize Socket.IO connection
    const socket = io(socketUrl, {
      path: "/api/socket_io",
      transports: ['websocket', 'polling'],
      forceNew: true,
      timeout: 5000
    });

  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("✅ Terhubung ke server:", socket.id);
    setIsConnected(true);
    setIsConnecting(false);
  });

  socket.on("message", (data: ChatMessage) => {
    console.log("Pesan diterima:", data);
    setChat((prev) => [...prev, data]);
  });

  socket.on("load_messages", (messages: ChatMessage[]) => {
    console.log("Pesan lama dimuat:", messages);
    setChat(messages);
  });

  socket.on("disconnect", () => {
    console.log("❌ Terputus dari server");
    setIsConnected(false);
    setIsConnecting(false);
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
    setIsConnected(false);
    setIsConnecting(false);
  });

  socket.on("connecting", () => {
    console.log("🔄 Menghubungkan...");
    setIsConnecting(true);
  });

  return () => {
    socket.disconnect();
  };
}, []);

  const kirimPesan = () => {
    if (pesan.trim() !== "" && username.trim() !== "") {
      console.log("Mengirim pesan:", { username: username.trim(), isi: pesan.trim() });
      const messageData = {
        username: username.trim(),
        isi: pesan.trim()
      };
      socketRef.current?.emit("message", messageData);
      setPesan("");
    } else {
      console.log("Tidak bisa kirim pesan - username atau pesan kosong");
    }
  };
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Realtime Chat (Next.js + Socket.IO)</h1>

      {/* Connection Status */}
      <div className={`mb-4 p-2 rounded ${
        isConnecting ? 'bg-yellow-100 text-yellow-800' :
        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        Status: {
          isConnecting ? 'Menghubungkan...' :
          isConnected ? 'Terhubung' : 'Terputus'
        }
      </div>

      {/* Username Input */}
      <div className="mb-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={false}
        />
        <p className="text-xs text-gray-500 mt-1">Username bisa diubah kapan saja</p>
      </div>

      {/* Chat Messages */}
      <div className="border rounded p-3 h-64 overflow-y-auto bg-gray-50 mb-4">
        {chat.map((msg, i) => (
          <div key={i} className="mb-2 p-2 border-b border-gray-200 bg-white rounded">
            <div className="font-semibold text-blue-600">{msg.username}</div>
            <div className="text-gray-800">{msg.isi}</div>
            {msg.waktu && (
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.waktu).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && kirimPesan()}
            placeholder="Ketik pesan..."
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
              !username.trim() ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-blue-500'
            }`}
            disabled={!username.trim()}
          />
          {!username.trim() && (
            <p className="text-xs text-red-500 mt-1">Masukkan username terlebih dahulu</p>
          )}
        </div>
        <button
          onClick={kirimPesan}
          className={`px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed ${
            username.trim() && pesan.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
          } text-white transition-colors`}
          disabled={!username.trim() || !pesan.trim()}
        >
          Kirim
        </button>
      </div>
    </div>
  );
}