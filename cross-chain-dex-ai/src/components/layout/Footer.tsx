'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-12 sm:mt-16 md:mt-24 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          
          {/* Brand Section */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-3 sm:mb-4">
              <Image
                src="/cdex-ai-logo.png"
                alt="C-DEX AI"
                width={32}
                height={32}
                className="rounded-full w-7 h-7 sm:w-8 sm:h-8"
              />
              <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                C-DEX AI
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              AI-powered cross-chain decentralized exchange. Trade seamlessly across Ethereum and Polygon with intelligent guidance.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/swap" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 transition-colors">
                  Swap
                </Link>
              </li>
              <li>
                <Link href="/bridge" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 transition-colors">
                  Bridge
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/docs" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 transition-colors flex items-center gap-1">
                  Documentation
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">
              Community
            </h3>
            <div className="flex space-x-3 sm:space-x-4">
              <Link
                href="#"
                className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Github className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} C-DEX AI. All rights reserved.
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
