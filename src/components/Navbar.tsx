'use client';

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/80 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            AI Dungeon
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/rooms" className="text-gray-300 hover:text-white transition-colors">
              Rooms
            </Link>
            <Link href="/ai-settings" className="text-gray-300 hover:text-white transition-colors">
              AI Settings
            </Link>
            <Link href="/account" className="text-gray-300 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 