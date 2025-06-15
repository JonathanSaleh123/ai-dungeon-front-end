'use client';

import React from 'react';
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import ReactiveBackground from "@/components/ReactiveBackground";

// Mock data for rooms - this will be replaced with real data later
const mockRooms = [
  {
    id: 1,
    name: "Dragon's Lair",
    players: 3,
    maxPlayers: 4,
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Forest of Shadows",
    players: 2,
    maxPlayers: 4,
    status: "active",
    lastActive: "5 minutes ago",
  },
  {
    id: 3,
    name: "Castle Ruins",
    players: 4,
    maxPlayers: 4,
    status: "full",
    lastActive: "1 hour ago",
  },
];

export default function RoomsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-24">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please sign in to view your rooms</h1>
            <p className="text-gray-300">You need to be signed in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReactiveBackground />
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Your Rooms
              </h1>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                Create New Room
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg hover:bg-gray-800/70 transition duration-200 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-purple-400">{room.name}</h2>
                    <span className={`px-2 py-1 rounded text-sm ${
                      room.status === 'full' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {room.status === 'full' ? 'Full' : 'Active'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Players</span>
                      <span>{room.players}/{room.maxPlayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Active</span>
                      <span>{room.lastActive}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    Join Room
                  </button>
                </div>
              ))}
            </div>

            {mockRooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg mb-4">You haven't created any rooms yet</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                  Create Your First Room
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 