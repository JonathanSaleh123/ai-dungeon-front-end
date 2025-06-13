'use client';

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ReactiveBackground from "@/components/ReactiveBackground";

export default function Home() {
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
          </div>

          <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Create Room Section */}
              <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Create Room</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="createName" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="createName"
                      className="w-full px-4 py-2 rounded bg-gray-600/50 border border-gray-500 text-white focus:outline-none focus:border-purple-500"
                      placeholder="Enter your name"
                    />
                  </div>
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
                    <label htmlFor="joinName" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="joinName"
                      className="w-full px-4 py-2 rounded bg-gray-600/50 border border-gray-500 text-white focus:outline-none focus:border-pink-500"
                      placeholder="Enter your name"
                    />
                  </div>
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
          </div>

          <div className="text-center mt-12 text-gray-400">
            <p>Create your own story or join friends in an epic adventure</p>
          </div>
        </div>
      </div>
    </>
  );
}
