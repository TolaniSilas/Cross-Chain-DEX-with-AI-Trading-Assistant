import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ParticleBackground from '@/components/common/ParticleBackground'
import {
  ShieldCheck,
  Info,
  UserCheck,
  AlertTriangle,
  ExternalLink,
  KeyRound,
  Ban,
  BadgeCheck,
  AlertCircle,
  Scale,
  RefreshCw,
  Gavel,
  Mail,
} from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <ParticleBackground />
      </div>

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20">
        <section className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-100 shadow-xl shadow-blue-100/40 px-5 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12">
          <header className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h1 className="text-xl sm:text-4xl font-extrabold text-blue-600 whitespace-nowrap">
                  Terms of Use
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap shrink-0">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <h2 className="mt-8 sm:mt-10 mb-6 sm:mb-8 text-lg sm:text-xl font-bold text-gray-800 text-center">
              Legal terms for using the C-DEX AI trading interface.
            </h2>
          </header>

          <div className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-2 text-center">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[11px] sm:text-xs font-medium text-blue-700">
              Non-custodial interface
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[11px] sm:text-xs font-medium text-blue-700">
              AI-assisted, not financial advice
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[11px] sm:text-xs font-medium text-blue-700">
              High-risk crypto assets
            </span>
          </div>

          <div className="space-y-6 sm:space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              These Terms of Use (&quot;Terms&quot;) govern your access to and use of the C-DEX AI interface
              (the &quot;Interface&quot;), including any content, functionality and services offered on or
              through it. By accessing or using the Interface, you agree to be bound by these Terms. If
              you do not agree, you must not use the Interface.
            </p>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>What C-DEX AI Is</span>
              </h3>
              <p>
                C-DEX AI is a non-custodial, AI-assisted interface that lets you interact with public
                blockchain networks and third-party protocols (such as decentralized exchanges, bridges,
                and on/off-ramp services). The Interface itself does not hold your assets, execute
                transactions on your behalf, or custody your private keys. All transactions are executed
                by you directly from your connected wallet.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Eligibility &amp; User Responsibilities</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>You must be legally able to use the Interface under the laws that apply to you.</li>
                <li>
                  You are solely responsible for your wallet, private keys, seed phrase, and any devices
                  or software you use to access the Interface.
                </li>
                <li>
                  You agree not to use the Interface if you are subject to sanctions or other legal
                  restrictions that would make such use unlawful.
                </li>
                <li>
                  You are responsible for all actions taken from your wallet address, including all
                  on-chain transactions you sign.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span>No Investment, Tax, or Legal Advice</span>
              </h3>
              <p>
                The Interface, including any AI-generated insights, explanations, or suggestions, is
                provided for informational and educational purposes only. Nothing on or through the
                Interface is, or should be considered, investment, trading, tax, or legal advice. You
                are solely responsible for your own research and decisions. You should consult qualified
                professional advisers before making any financial or legal decisions.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span>Risks of Using Blockchain Protocols</span>
              </h3>
              <p className="mb-2">
                Using blockchain networks and related protocols involves significant risks, including but
                not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>High price volatility of digital assets.</li>
                <li>Smart contract bugs or exploits that may lead to partial or total loss of funds.</li>
                <li>Network congestion, failed or delayed transactions, and increased gas fees.</li>
                <li>
                  Front-running, MEV, oracle failures, or other market-manipulation risks when interacting
                  with on-chain liquidity.
                </li>
                <li>Counterparty and protocol risks when using third-party services (bridges, ramps, CEXs).</li>
              </ul>
              <p className="mt-2">
                You acknowledge and accept these risks and agree that you use the Interface and connected
                protocols entirely at your own risk.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>Third-Party Services &amp; Links</span>
              </h3>
              <p>
                The Interface may route you to, or display information from, third-party services and
                protocols, including decentralized exchanges, bridges, block explorers, price oracles,
                analytics providers, and centralized exchanges or on/off-ramp providers (for example,
                Binance or others). These services are not controlled by C-DEX AI and are provided
                subject to their own terms and policies. C-DEX AI does not endorse, warrant, or assume
                responsibility for any third-party services or content.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Non-Custodial Nature</span>
              </h3>
              <p>
                C-DEX AI is a non-custodial interface. We do not custody or control your digital assets,
                private keys, or seed phrases. We cannot recover lost private keys or reverse on-chain
                transactions. You are solely responsible for safeguarding your wallet credentials and
                backing up your seed phrase in a secure manner.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Ban className="w-4 h-4 text-blue-600" />
                <span>Prohibited Uses</span>
              </h3>
              <p className="mb-2">
                You agree not to use the Interface in any way that:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Violates any applicable law or regulation, including sanctions, anti-money laundering,
                  or counter-terrorist financing laws.
                </li>
                <li>
                  Attempts to interfere with, disrupt, or compromise the security or integrity of the
                  Interface, underlying smart contracts, or any related infrastructure.
                </li>
                <li>
                  Involves automated scraping, rate-limiting evasion, or abusive API usage.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-blue-600" />
                <span>Intellectual Property</span>
              </h3>
              <p>
                The Interface, including the C-DEX AI name, logo, UI design, and associated content, is
                owned by or licensed to C-DEX AI and is protected by intellectual property laws. You are
                granted a limited, non-exclusive, non-transferable license to use the Interface solely
                for its intended purpose, subject to these Terms. You may not copy, modify, distribute,
                or create derivative works based on the Interface without prior written permission.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span>No Warranties</span>
              </h3>
              <p>
                The Interface is provided on an &quot;as is&quot; and &quot;as available&quot; basis,
                without warranties of any kind, express or implied. C-DEX AI does not warrant that the
                Interface will be secure, error-free, uninterrupted, or that any defects will be
                corrected. On-chain data, prices, and analytics may be delayed, inaccurate, or
                incomplete. You rely on all such information at your own risk.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Limitation of Liability</span>
              </h3>
              <p>
                To the maximum extent permitted by law, C-DEX AI and its contributors will not be liable
                for any indirect, incidental, special, consequential, or punitive damages, or for any
                loss of profits, revenues, data, or digital assets, whether incurred directly or
                indirectly, arising from or in connection with your use of the Interface or any linked
                third-party services. In no event shall our aggregate liability arising out of or
                relating to your use of the Interface exceed the amount you have paid (if any) for
                accessing the Interface in the twelve (12) months preceding the event giving rise to the
                claim.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Changes to the Interface and Terms</span>
              </h3>
              <p>
                We may modify, suspend, or discontinue any part of the Interface at any time without
                notice. We may also update these Terms from time to time. When we do, we will update the
                &quot;Last updated&quot; date at the top of this page. Your continued use of the
                Interface after any changes constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-blue-600" />
                <span>Governing Law</span>
              </h3>
              <p>
                These Terms and any dispute related to them or your use of the Interface will be governed
                by and construed in accordance with the laws of the jurisdiction specified by C-DEX AI,
                without regard to conflict-of-law principles. You agree to submit to the exclusive
                jurisdiction of the courts located in that jurisdiction for the resolution of any
                disputes, subject to any mandatory arbitration or other dispute-resolution mechanisms
                that may be specified here.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Contact</span>
              </h3>
              <p>
                If you have any questions about these Terms, you can contact us at:{' '}
                <a href="mailto:osunbasilas@gmail.com" className="text-blue-600 hover:text-blue-700 underline">
                  osunbasilas@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

