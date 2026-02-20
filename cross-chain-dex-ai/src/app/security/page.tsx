import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ParticleBackground from '@/components/common/ParticleBackground'
import Link from 'next/link'
import { ShieldCheck, KeyRound, Link2, AlertTriangle, Lock, Bug } from 'lucide-react'

export const metadata = {
  title: 'Security - C-DEX AI',
  description: 'Security practices, risk disclosures, and transparency statements',
}

const sectionCard = 'bg-white/85 backdrop-blur border border-blue-100 rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 opacity-30">
        <ParticleBackground />
      </div>

      <Header />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Security & Transparency</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            How C-DEX AI handles custody, data sources, dependencies, and responsible disclosure.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <ShieldCheck className="w-5 h-5" /> Non-Custodial Statement
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              C-DEX AI is non-custodial: private keys remain in user wallets. The app does not take custody of funds and cannot move assets without explicit wallet authorization.
            </p>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <Link2 className="w-5 h-5" /> Dependency Disclosure
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
              <li>Pricing data: CoinGecko API via internal proxy routes.</li>
              <li>Swap quotes/build: 1inch APIs (when configured).</li>
              <li>Bridge quotes/build: Socket APIs (when configured).</li>
              <li>On-chain balances/read operations: wagmi + viem over configured RPC endpoints.</li>
            </ul>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <KeyRound className="w-5 h-5" /> API Keys and Rate Limiting
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
              <li>Sensitive provider keys are expected through environment variables.</li>
              <li>Internal API routes implement request rate limiting to reduce abuse.</li>
              <li>For production scale, move rate limiting to distributed storage (e.g. Redis/Upstash).</li>
            </ul>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <AlertTriangle className="w-5 h-5" /> Phishing and Official Links
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
              <li>Always verify you are on the official app domain before connecting wallet.</li>
              <li>Never share seed phrase/private key. C-DEX AI will never request it.</li>
              <li>Use only official community links in footer: X and GitHub.</li>
            </ul>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <Lock className="w-5 h-5" /> Privacy Summary
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              The app uses wallet addresses and request metadata only to execute requested actions and display user-specific portfolio information. No private keys are stored. Third-party providers may process request metadata according to their own policies.
            </p>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <Bug className="w-5 h-5" /> Responsible Disclosure
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              If you discover a vulnerability, please report privately through the project repository issue/disclosure channel:
            </p>
            <p className="mt-2 text-sm sm:text-base">
              <a
                href="https://github.com/TolaniSilas/Cross-Chain-DEX-with-AI-Trading-Assistant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-semibold hover:text-blue-800"
              >
                github.com/TolaniSilas/Cross-Chain-DEX-with-AI-Trading-Assistant
              </a>
            </p>
          </section>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Learn usage details in <Link href="/docs" className="text-blue-700 font-semibold hover:text-blue-800">Documentation</Link> and common issues in <Link href="/faq" className="text-blue-700 font-semibold hover:text-blue-800">FAQ</Link>.
        </p>
      </main>

      <Footer />
    </div>
  )
}
