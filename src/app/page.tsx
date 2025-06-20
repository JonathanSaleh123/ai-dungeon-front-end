'use client';

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import ReactiveBackground from "@/components/ReactiveBackground";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

// Ensure this environment variable is correctly set in your .env.local
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500";

export default function Home() {
  const { data: session, status } = useSession();
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const router = useRouter();

  // Clear errors when inputs change
  useEffect(() => {
    if (joinRoomCode) setJoinError("");
    setCreateError(""); // Clear create error when other inputs change or on initial load
  }, [joinRoomCode]);

  // Function to create a temporary socket for initial room creation/joining
  const createTransientSocketConnection = (): Socket => {
    // forceNew: true is appropriate here because these sockets are short-lived
    // and we want a fresh connection for each create/join attempt from the home page.
    return io(SOCKET_URL, { 
      transports: ["websocket"],
      timeout: 5000,
      forceNew: true 
    });
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.name) {
      setCreateError("Please sign in to create a room.");
      return;
    }

    setCreateError("");
    setCreating(true);

    const socket = createTransientSocketConnection();
    
    // Log connection events for debugging
    socket.on('connect', () => {
      console.log('Home: Socket connected for room creation, ID:', socket.id);
      socket.emit(
        "createRoom",
        { username: session.user?.name || "Adventurer" },
        (res: { success: boolean; roomCode?: string; error?: string }) => {
          console.log('Home: Create room response:', res);
          setCreating(false);
          
          if (res.success && res.roomCode) {
            // DO NOT disconnect here. Let the navigation happen and the new page's socket connect.
            // This socket will naturally disconnect as the component unmounts.
            console.log('Home: Navigating to room, will let this transient socket disconnect naturally.');
            router.push(`/rooms/${res.roomCode}`);
          } else {
            setCreateError(res.error || "Failed to create room.");
            // Disconnect on failure here, as we are not navigating
            socket.disconnect();
            console.log('Home: Disconnecting transient socket after create room failure.');
          }
        }
      );
    });

    socket.on('connect_error', (error) => {
      console.error('Home: Connection error for room creation:', error);
      setCreating(false);
      setCreateError("Unable to connect to server. Please check your network and try again.");
      socket.disconnect(); // Ensure disconnection on error
    });

    socket.on('disconnect', (reason) => {
      console.log('Home: Transient socket disconnected, reason:', reason);
      if (creating) {
        setCreating(false);
        setCreateError("Connection lost during room creation. Please try again.");
      }
    });
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.name) {
      setJoinError("Please sign in to join a room.");
      return;
    }
    
    setJoinError("");
    
    if (!joinRoomCode.trim()) {
      setJoinError("Please enter a room code.");
      return;
    }

    setJoining(true);
    const socket = createTransientSocketConnection();
    
    // Log connection events for debugging
    socket.on('connect', () => {
      console.log('Home: Socket connected for joining room, ID:', socket.id);
      socket.emit(
        "joinRoom",
        { 
          roomCode: joinRoomCode.trim().toUpperCase(), 
          username: session.user?.name || "Adventurer" 
        },
        (res: { success: boolean; error?: string }) => {
          console.log('Home: Join room response:', res);
          setJoining(false);
          
          if (res.success) {
            // DO NOT disconnect here. Let the navigation happen and the new page's socket connect.
            // This socket will naturally disconnect as the component unmounts.
            console.log('Home: Navigating to room, will let this transient socket disconnect naturally.');
            router.push(`/rooms/${joinRoomCode.trim().toUpperCase()}`);
          } else {
            setJoinError(res.error || "Failed to join room.");
            // Disconnect on failure here
            socket.disconnect();
            console.log('Home: Disconnecting transient socket after join room failure.');
          }
        }
      );
    });

    socket.on('connect_error', (error) => {
      console.error('Home: Connection error for joining room:', error);
      setJoining(false);
      setJoinError("Unable to connect to server. Please check your network and try again.");
      socket.disconnect(); // Ensure disconnection on error
    });

    socket.on('disconnect', (reason) => {
      console.log('Home: Transient socket disconnected, reason:', reason);
      if (joining) {
        setJoining(false);
        setJoinError("Connection lost during room join. Please try again.");
      }
    });
  };

  return (
    <>
      <ReactiveBackground />
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-24">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              AI Dungeon
            </h1>
            <p className="text-xl text-gray-300">
              Enter a world of endless possibilities with AI-powered storytelling
            </p>
            {status === "authenticated" && (
              <div className="mt-4">
                <p className="text-gray-300">
                  Welcome, {session.user?.name || "Adventurer"}!
                </p>
              </div>
            )}
          </div>

          <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
            {status === "authenticated" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Room Section */}
                <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-purple-400">Create Room</h2>
                  <form className="space-y-4" onSubmit={handleCreateRoom}>
                    {createError && (
                      <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded">
                        {createError}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition duration-200"
                      disabled={creating || status !== "authenticated"}
                    >
                      {creating ? "Creating..." : "Create Room"}
                    </button>
                  </form>
                </div>

                {/* Join Room Section */}
                <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-pink-400">Join Room</h2>
                  <form className="space-y-4" onSubmit={handleJoinRoom}>
                    <div>
                      <label htmlFor="roomCode" className="block text-sm font-medium text-gray-300 mb-2">
                        Room Code
                      </label>
                      <input
                        type="text"
                        id="roomCode"
                        value={joinRoomCode}
                        onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2 rounded bg-gray-600/50 border border-gray-500 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        placeholder="Enter room code"
                        disabled={joining}
                        maxLength={6}
                      />
                    </div>
                    {joinError && (
                      <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded">
                        {joinError}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition duration-200"
                      disabled={joining || !joinRoomCode.trim() || status !== "authenticated"}
                    >
                      {joining ? "Joining..." : "Join Room"}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-300 mb-4">Please sign in to continue</p>
                <button
                  onClick={() => signIn("google")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Loading..." : "Sign In"}
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-12 text-gray-400">
            <p>Create your own story or join friends in an epic adventure</p>
          </div>
        </div>
      </div>
    </>
  );
}
