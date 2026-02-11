'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, Sun, Moon, Menu, X } from 'lucide-react'

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme)
    setShowThemeMenu(false)
    
    if (typeof window !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (newTheme === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        // Auto: use system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo + Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/cdex-ai-logo.png" 
                alt="C-DEX AI" 
                width={32} 
                height={32}
                className="rounded-full"
              />
              <h1 className="text-xl font-bold text-gray-900">C-DEX AI</h1>
            </Link>

            {/* Desktop Navigation - Left side after logo */}
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/swap" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Swap
              </Link>
              <Link 
                href="/bridge" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Bridge
              </Link>
              <Link 
                href="/portfolio" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Portfolio
              </Link>
            </nav>
          </div>

          {/* Right side: Search + Theme + Wallet */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop only */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search tokens and pools"
                className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Theme selector"
              >
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-700" />
                ) : theme === 'light' ? (
                  <Sun className="w-5 h-5 text-gray-700" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {/* Theme Dropdown Menu */}
              {showThemeMenu && (
                <>
                  {/* Backdrop to close menu when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThemeMenu(false)}
                  />
                  {/* Theme Menu */}
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-100">
                      Theme
                    </div>
                    <button
                      onClick={() => toggleTheme('auto')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        theme === 'auto' ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      onClick={() => toggleTheme('light')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center ${
                        theme === 'light' ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </button>
                    <button
                      onClick={() => toggleTheme('dark')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center ${
                        theme === 'dark' ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Wallet Connect Button - Desktop */}
            <div className="hidden sm:block">
              <ConnectButton />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="mb-4 px-2">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search tokens and pools"
                  className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/swap" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Swap
              </Link>
              <Link 
                href="/bridge" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bridge
              </Link>
              <Link 
                href="/portfolio" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              
              {/* Mobile Wallet Connect */}
              <div className="pt-4 border-t border-gray-200 px-2">
                <ConnectButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}