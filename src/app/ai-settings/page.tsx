'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import ReactiveBackground from "@/components/ReactiveBackground";

export default function AISettingsPage() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState({
    creativity: 0.7,
    responseLength: 'medium',
    temperature: 0.8,
    enableContextMemory: true,
    maxContextLength: 10,
  });

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
            <h1 className="text-3xl font-bold mb-4">Please sign in to view AI settings</h1>
            <p className="text-gray-300">You need to be signed in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      <ReactiveBackground />
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16 pt-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              AI Settings
            </h1>

            <div className="space-y-8">
              {/* Creativity Level */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Creativity Level</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Creativity: {Math.round(settings.creativity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.creativity}
                      onChange={(e) => handleSettingChange('creativity', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Response Settings */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Response Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Response Length</label>
                    <select
                      value={settings.responseLength}
                      onChange={(e) => handleSettingChange('responseLength', e.target.value)}
                      className="bg-gray-700 text-white px-3 py-2 rounded w-full"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Temperature: {settings.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Context Settings */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Context Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">Enable Context Memory</label>
                    <button
                      onClick={() => handleSettingChange('enableContextMemory', !settings.enableContextMemory)}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                        settings.enableContextMemory ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                        settings.enableContextMemory ? 'right-1' : 'left-1'
                      }`}></div>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Context Length: {settings.maxContextLength} messages
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={settings.maxContextLength}
                      onChange={(e) => handleSettingChange('maxContextLength', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    // TODO: Implement save settings API call
                    console.log('Saving settings:', settings);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition duration-200"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 