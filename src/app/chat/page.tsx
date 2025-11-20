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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white py-16 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Realtime Chat
            </h1>
            <p className="text-lg text-blue-100">Diskusi dan berbagi informasi dengan mahasiswa lainnya</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* Connection Status */}
          <div className={`mb-6 p-4 rounded-xl font-medium text-center ${
            isConnecting ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
            isConnected ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            <span className="inline-flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              Status: {
                isConnecting ? 'Menghubungkan...' :
                isConnected ? 'Terhubung' : 'Terputus'
              }
            </span>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={false}
            />
            <p className="text-xs text-gray-500 mt-2">Username bisa diubah kapan saja</p>
          </div>

          {/* Chat Messages */}
          <div className="border-2 border-gray-200 rounded-xl p-4 h-96 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 mb-6">
            {chat.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Belum ada pesan. Mulai percakapan!</p>
              </div>
            ) : (
              chat.map((msg, i) => (
                <div key={i} className="mb-3 p-4 border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-bold text-blue-600 mb-1">{msg.username}</div>
                  <div className="text-gray-800">{msg.isi}</div>
                  {msg.waktu && (
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(msg.waktu).toLocaleString('id-ID', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && kirimPesan()}
                placeholder="Ketik pesan..."
                className={`w-full p-3 border-2 rounded-xl focus:outline-none transition-all ${
                  !username.trim() ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
                disabled={!username.trim()}
              />
              {!username.trim() && (
                <p className="text-xs text-red-500 mt-2">⚠️ Masukkan username terlebih dahulu</p>
              )}
            </div>
            <button
              onClick={kirimPesan}
              className={`px-6 py-3 rounded-xl font-semibold transition-all disabled:cursor-not-allowed ${
                username.trim() && pesan.trim() 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                  : 'bg-gray-300 text-gray-500'
              }`}
              disabled={!username.trim() || !pesan.trim()}
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}