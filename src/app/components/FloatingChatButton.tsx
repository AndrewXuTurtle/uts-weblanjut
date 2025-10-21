"use client";

import { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from "react-icons/fi";
import io, { Socket } from "socket.io-client";

interface Message {
  id: number;
  username: string;
  isi: string;
  waktu: string;
}

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for open chat event from navbar
  useEffect(() => {
    const handleOpenChatEvent = () => {
      setIsOpen(true);
      setIsMinimized(false);
      if (!username.trim()) {
        setShowUsernamePrompt(true);
      }
    };

    window.addEventListener('openFloatingChat', handleOpenChatEvent);
    return () => window.removeEventListener('openFloatingChat', handleOpenChatEvent);
  }, [username]);

  // Initialize socket connection
  useEffect(() => {
    if (isOpen && !socketRef.current) {
      // Use current host with port for proper connection
      const currentHost = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
      const socketUrl = `http://${currentHost}`;

      console.log('Connecting to:', socketUrl);

      socketRef.current = io(socketUrl, {
        path: '/api/socket_io',
        transports: ['websocket', 'polling'],
        forceNew: true,
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to chat server:', socketRef.current?.id);
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Disconnected from chat server');
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        setIsConnected(false);
      });

      socketRef.current.on('load_messages', (loadedMessages: Message[]) => {
        console.log('📨 Loaded messages:', loadedMessages.length);
        setMessages(loadedMessages);
      });

      socketRef.current.on('message', (message: Message) => {
        console.log('💬 New message:', message);
        setMessages(prev => [...prev, message]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !username.trim() || !socketRef.current) return;

    socketRef.current.emit('message', {
      username: username.trim(),
      isi: newMessage.trim(),
    });

    setNewMessage("");
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!username.trim()) {
      setShowUsernamePrompt(true);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setShowUsernamePrompt(false);
  };

  const handleMinimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).username.value;
    if (input.trim()) {
      setUsername(input.trim());
      setShowUsernamePrompt(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={handleOpenChat}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
            title="Open Live Chat"
          >
            <FiMessageSquare className="w-6 h-6" />
          </button>
        )}

        {/* Chat Notification Badge */}
        {messages.length > 0 && !isOpen && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
            {messages.length > 9 ? '9+' : messages.length}
          </div>
        )}
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-14' : 'w-80 h-96'
        }`}>
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiMessageSquare className="w-5 h-5" />
                <span className="font-semibold text-sm">Live Chat</span>
                {isConnected && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleMinimizeChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  <FiMinimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Close Chat"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Username Prompt */}
                {showUsernamePrompt && (
                  <div className="p-4 bg-blue-50 border-b">
                    <form onSubmit={handleUsernameSubmit} className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Masukkan nama Anda untuk mulai chat:
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          name="username"
                          placeholder="Nama Anda"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          Mulai
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm py-8">
                      <FiMessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Belum ada pesan. Mulai percakapan!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.username === username ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.username === username
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="font-medium text-xs mb-1 opacity-75">
                            {message.username}
                          </div>
                          <div>{message.isi}</div>
                          <div className="text-xs opacity-75 mt-1">
                            {formatTime(message.waktu)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {username && (
                  <div className="p-4 border-t bg-gray-50">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan Anda..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isConnected}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || !isConnected}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiSend className="w-4 h-4" />
                      </button>
                    </form>
                    {!isConnected && (
                      <p className="text-xs text-red-500 mt-1">Terputus dari server chat</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}