import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ParticleBackground from '@/components/common/ParticleBackground'
import Link from 'next/link'
import { CircleHelp } from 'lucide-react'

export const metadata = {
  title: 'FAQ - C-DEX AI',
  description: 'Frequently asked questions for C-DEX AI testnet usage',
}

const faqs = [
  {
    q: 'Why can token price and balance feel inconsistent sometimes?',
    a: 'Price comes from market APIs (CoinGecko), while balance comes directly from chain RPC. They update on different schedules, so small temporary differences are normal.',
  },
  {
    q: 'Why is a token showing 0 balance?',
    a: 'The connected address may not hold that token on the selected chain, or you may be connected to a different network than expected.',
  },
  {
    q: 'Why can a swap or bridge quote fail?',
    a: 'Common causes: unsupported route, temporary API/provider outage, low liquidity on testnet, invalid amount, or rate limiting.',
  },
  {
    q: 'Why does transaction execution fail after quote?',
    a: 'Routes can change quickly. If slippage is too tight, gas is insufficient, or state changes before submission, execution may revert.',
  },
  {
    q: 'How are gas fees handled?',
    a: 'Gas is paid in native chain coin (ETH on Sepolia, MATIC on Amoy). Keep enough native balance for approvals + execution.',
  },
  {
    q: 'Where can I get testnet tokens?',
    a: 'Use faucets: Sepolia ETH faucet and Polygon Amoy faucet. Official resources are linked below.',
  },
  {
    q: 'Is this real money?',
    a: 'No. This project is currently configured for testnets only. Testnet tokens do not represent real monetary value.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 opacity-30">
        <ParticleBackground />
      </div>

      <Header />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">FAQ</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Frequently asked questions for swap, bridge, portfolio, and testnet operations.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {faqs.map((item) => (
            <section key={item.q} className="bg-white/85 backdrop-blur border border-blue-100 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="flex items-start gap-2 text-base sm:text-lg font-semibold text-blue-800 mb-2">
                <CircleHelp className="w-5 h-5 mt-0.5 shrink-0" />
                <span>{item.q}</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{item.a}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 bg-white/85 backdrop-blur border border-blue-100 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">Testnet Faucet Links</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
            <li><a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:text-blue-800">Sepolia Faucet</a></li>
            <li><a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:text-blue-800">Polygon Amoy Faucet</a></li>
          </ul>
        </section>

        <p className="mt-8 text-center text-sm text-gray-600">
          For implementation details, visit <Link href="/docs" className="text-blue-700 font-semibold hover:text-blue-800">Documentation</Link>. For trust and safety, review <Link href="/security" className="text-blue-700 font-semibold hover:text-blue-800">Security</Link>.
        </p>
      </main>

      <Footer />
    </div>
  )
}
