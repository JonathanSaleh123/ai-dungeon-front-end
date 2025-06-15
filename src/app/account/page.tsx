'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import ReactiveBackground from "@/components/ReactiveBackground";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [newUsername, setNewUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
            <h1 className="text-3xl font-bold mb-4">Please sign in to view your account</h1>
            <p className="text-gray-300">You need to be signed in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleUsernameChange = async () => {
    // TODO: Implement username change API call
    setIsEditing(false);
  };

  return (
    <>
      <ReactiveBackground />
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Account Settings
            </h1>

            <div className="grid grid-cols-1 gap-8">
              {/* Profile Information */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="bg-gray-700 text-white px-3 py-2 rounded flex-grow"
                          placeholder="Enter new username"
                        />
                        <button
                          onClick={handleUsernameChange}
                          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-white">{session?.user?.name}</div>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="text-white">{session?.user?.email}</div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Account Actions</h2>
                <div className="space-y-4">
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    Delete Account
                  </button>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 