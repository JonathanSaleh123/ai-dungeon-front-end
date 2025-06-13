'use client';

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import ReactiveBackground from "@/components/ReactiveBackground";

export default function Home() {
  const { data: session, status } = useSession();

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
                  <form className="space-y-4">
                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      Create Room
                    </button>
                  </form>
                </div>

                {/* Join Room Section */}
                <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-pink-400">Join Room</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="roomCode" className="block text-sm font-medium text-gray-300 mb-2">
                        Room Code
                      </label>
                      <input
                        type="text"
                        id="roomCode"
                        className="w-full px-4 py-2 rounded bg-gray-600/50 border border-gray-500 text-white focus:outline-none focus:border-pink-500"
                        placeholder="Enter room code"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      Join Room
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
                >
                  Sign In
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
