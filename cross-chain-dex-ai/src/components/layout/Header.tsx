'use client'

// import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">DEX AI</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/swap" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Swap
            </Link>
            <Link 
              href="/bridge" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Bridge
            </Link>
            <Link 
              href="/portfolio" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Portfolio
            </Link>
          </nav>

          {/* Wallet Connect Button */}
          <div>
            {/* <ConnectButton /> */}
          </div>
        </div>
      </div>
    </header>
  )
}