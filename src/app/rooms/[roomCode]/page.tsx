"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import Navbar from "@/components/Navbar";
import ReactiveBackground from "@/components/ReactiveBackground";

// Ensure this environment variable is correctly set in your .env.local
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500";

interface User {
  id: string;
  username: string;
}

interface Message {
  username: string;
  message: string;
  time: number;
}

export default function RoomChatPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [joining, setJoining] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle room joining and socket connection
  const initializeSocket = useCallback(() => {
    // Only proceed if session is ready, roomCode is available, and socket not already initialized
    if (status !== "authenticated" || !session?.user?.name || !roomCode || socketRef.current) {
      console.log('RoomChatPage: Skipping socket initialization - conditions not met or already initialized.');
      return;
    }

    console.log('RoomChatPage: Initializing socket connection...');
    // Removed forceNew: true to allow Socket.IO to manage persistent connections and reconnections gracefully
    const socket = io(SOCKET_URL, { 
      transports: ["websocket"],
      timeout: 5000,
      // forceNew: true, // Removed this line
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('RoomChatPage: Connected to server, Socket ID:', socket.id);
      setConnected(true);
      
      const username = session.user?.name || "Adventurer";
      // Emit joinRoom only after successful connection
      socket.emit("joinRoom", { roomCode, username }, (res: { success: boolean; error?: string }) => {
        console.log('RoomChatPage: Join room response:', res);
        setJoining(false); // No longer joining after response
        
        if (!res.success) {
          setError(res.error || "Failed to join room.");
          console.error('RoomChatPage: Failed to join room, redirecting to home.');
          setTimeout(() => router.push("/"), 3000);
        } else {
          console.log('RoomChatPage: Successfully joined room.');
        }
      });
    });

    socket.on('connect_error', (err) => {
      console.error('RoomChatPage: Socket connection error:', err);
      setConnected(false);
      setJoining(false);
      setError("Unable to connect to the server. Please check your network and try again.");
    });

    socket.on('disconnect', (reason) => {
      console.log('RoomChatPage: Socket disconnected, reason:', reason);
      setConnected(false);
      // If server intentionally disconnected, try to reconnect.
      // Socket.IO's default behavior often handles this without explicit socket.connect()
      // But keeping it here for 'io server disconnect' specific scenarios.
      if (reason === 'io server disconnect') {
        console.log('RoomChatPage: Server initiated disconnect, attempting to reconnect...');
        socket.connect(); 
      }
      // If the disconnect reason is 'transport close' or 'ping timeout'
      // Socket.IO client will automatically try to reconnect.
    });

    socket.on("roomUpdate", (room: { users: User[] }) => {
      console.log('RoomChatPage: Room update received:', room);
      setUsers(room.users || []);
    });

    socket.on("chatMessage", (msg: Message) => {
      console.log('RoomChatPage: Chat message received:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    // Return a cleanup function that disconnects the socket when the component unmounts
    return () => {
      if (socketRef.current) {
        console.log('RoomChatPage: Cleaning up socket connection on unmount.');
        // Notify server that user is leaving the room before disconnecting
        socketRef.current.emit("leaveRoom", { roomCode });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session, status, roomCode, router]); // Dependencies for useCallback

  // Effect to call initializeSocket when session status changes to authenticated
  // and when roomCode is available. This effect runs only once when these conditions are met.
  useEffect(() => {
    if (status === "authenticated" && session && roomCode) {
      initializeSocket();
    }
  }, [status, session, roomCode, initializeSocket]); // Add initializeSocket to dependencies

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !socketRef.current || !session?.user?.name || !connected) {
      console.log('RoomChatPage: Cannot send message - conditions not met.');
      return;
    }

    const username = session.user.name;
    socketRef.current.emit("chatMessage", { 
      roomCode, 
      username, 
      message: input.trim() 
    });
    
    setInput("");
  };

  const handleLeaveRoom = () => {
    if (socketRef.current) {
      console.log('RoomChatPage: User initiated leave room, emitting leaveRoom event.');
      socketRef.current.emit("leaveRoom", { roomCode });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    router.push("/");
  };

  // Loading states
  if (status === "loading") {
    return (
      <>
        <ReactiveBackground />
        <div className="min-h-screen text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p>Loading user session...</p>
          </div>
        </div>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <ReactiveBackground />
        <div className="min-h-screen text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">Please sign in to access this room</p>
            <button
              onClick={() => router.push("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  if (joining) {
    return (
      <>
        <ReactiveBackground />
        <div className="min-h-screen text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p>Joining room...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ReactiveBackground />
        <div className="min-h-screen text-white flex items-center justify-center">
          <div className="text-red-400 text-center">
            <p className="text-xl mb-4">{error}</p>
            <p className="text-sm">Redirecting to home...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ReactiveBackground />
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-24 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Room: {roomCode}</h1>
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={connected ? 'text-green-400' : 'text-red-400'}>
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Users List */}
            <div className="lg:w-1/4 bg-gray-800/60 backdrop-blur-sm rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4 text-purple-400">
                Players ({users.length}/4)
              </h2>
              <ul className="space-y-2">
                {users.map((user) => (
                  <li 
                    key={user.id} 
                    className={`p-2 rounded text-sm ${
                      user.id === socketRef.current?.id 
                        ? 'bg-purple-600/30 text-purple-200' 
                        : 'text-gray-300'
                    }`}
                  >
                    {user.username}
                    {user.id === socketRef.current?.id && ' (You)'}
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat Section */}
            <div className="lg:w-3/4 bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 p-2 h-96 max-h-96">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="mb-3 p-2 hover:bg-gray-700/30 rounded">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-purple-300 min-w-0 flex-shrink-0">
                          {msg.username}:
                        </span>
                        <span className="break-words flex-1">{msg.message}</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(msg.time).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={connected ? "Type your message..." : "Connecting..."}
                  maxLength={200}
                  disabled={!connected}
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition duration-200"
                  disabled={!input.trim() || !connected}
                >
                  Send
                </button>
              </form>
              
              {!connected && (
                <p className="text-red-400 text-sm mt-2">
                  Connection lost. Trying to reconnect...
                </p>
              )}
            </div>
          </div>

          {/* Exit Button */}
          <div className="text-center mt-8">
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded transition duration-200"
              onClick={handleLeaveRoom}
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    </>
  );
}