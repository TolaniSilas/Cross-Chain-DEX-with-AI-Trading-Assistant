import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ParticleBackground from '@/components/common/ParticleBackground'
import {
  Lock,
  Info,
  Database,
  BarChart2,
  Cookie,
  Globe2,
  Share2,
  Clock,
  Shield,
  SlidersHorizontal,
  RefreshCw,
  Mail,
} from 'lucide-react'

export default function PrivacyPage() {
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
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h1 className="text-xl sm:text-4xl font-extrabold text-blue-600 whitespace-nowrap">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap shrink-0">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <h2 className="mt-8 sm:mt-10 mb-6 sm:mb-8 text-lg sm:text-xl font-bold text-gray-800 text-center">
              How C-DEX AI handles your data in a non-custodial way.
            </h2>
          </header>

          <div className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-2 text-center">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[11px] sm:text-xs font-medium text-blue-700">
              No private keys collected
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[11px] sm:text-xs font-medium text-blue-700">
              Minimal analytics
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[11px] sm:text-xs font-medium text-blue-700">
              On-chain data is public
            </span>
          </div>

          <div className="space-y-6 sm:space-y-8 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              This Privacy Policy explains how C-DEX AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
              handles information when you use the C-DEX AI interface (the &quot;Interface&quot;). We take
              a privacy-conscious approach and aim to collect as little personal data as is reasonably
              necessary to operate and improve the Interface. By using the Interface, you agree to the
              practices described in this policy.
            </p>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Non-Custodial Design</span>
              </h3>
              <p>
                C-DEX AI is a non-custodial interface for interacting with public blockchain networks and
                third-party protocols. We do not control your wallets or hold your private keys, seed
                phrases, or funds. Transactions you sign are broadcast directly to the relevant
                blockchain network from your wallet provider (for example, MetaMask or other compatible
                wallets).
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Information We Collect</span>
              </h3>
              <p className="mb-2">
                Depending on how you use the Interface, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <span className="font-semibold">Wallet information:</span> When you connect a wallet,
                  we can see your public wallet address and related on-chain data (such as token balances
                  and transaction history). This information is inherently public on the blockchain.
                </li>
                <li>
                  <span className="font-semibold">Usage and device data:</span> We may collect basic
                  technical information such as your browser type, operating system, language settings,
                  referring/exit pages, approximate location (based on IP), and interactions with the
                  Interface (e.g., which pages you visit, clicks, and timestamps). This may be collected
                  directly or through third-party analytics tools.
                </li>
                <li>
                  <span className="font-semibold">Support and communications:</span> If you contact us by
                  email or through other channels, we may store the information you provide (such as your
                  name, email address, and message content) in order to respond.
                </li>
              </ul>
              <p className="mt-2">
                We do <span className="font-semibold">not</span> collect or store private keys, seed
                phrases, or wallet passwords.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <span>How We Use Information</span>
              </h3>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Operate, maintain, and improve the Interface and its features.</li>
                <li>
                  Display relevant on-chain data for your connected wallet (for example, balances,
                  positions, and transaction history).
                </li>
                <li>
                  Provide AI-assisted explanations and suggestions, including context about assets,
                  transactions, or protocols you interact with.
                </li>
                <li>
                  Monitor performance, debug issues, and protect against fraud, abuse, and security
                  threats.
                </li>
                <li>Communicate with you if you contact us, and respond to your requests or questions.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Cookie className="w-4 h-4 text-blue-600" />
                <span>Cookies and Similar Technologies</span>
              </h3>
              <p>
                The Interface may use cookies, local storage, or similar technologies to remember your
                preferences (such as selected network, theme, or last-used options) and to understand how
                the Interface is used. Third-party analytics providers may also set cookies or use
                similar technologies to collect usage data. You can usually control or disable cookies
                through your browser settings, but some features of the Interface may not function
                properly if you do so.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>On-Chain Data and Third-Party APIs</span>
              </h3>
              <p>
                Because blockchains are public, information about your transactions, balances, and
                activity may be publicly visible and permanently recorded. The Interface may read this
                data directly from nodes or via third-party APIs (for example, block explorers or pricing
                services such as Etherscan or similar providers). Those third parties have their own
                privacy practices, which we do not control. We encourage you to review their policies
                when you interact with their services.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>Sharing of Information</span>
              </h3>
              <p className="mb-2">
                We may share information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <span className="font-semibold">Service providers:</span> With trusted third parties
                  that help us operate the Interface, such as hosting providers, analytics platforms, and
                  security monitoring services. These providers are expected to process data only on our
                  behalf and according to our instructions.
                </li>
                <li>
                  <span className="font-semibold">Legal and compliance:</span> If we believe disclosure is
                  reasonably necessary to comply with a law, regulation, legal process, or governmental
                  request, or to protect the rights, property, or safety of C-DEX AI, our users, or
                  others.
                </li>
                <li>
                  <span className="font-semibold">Business transfers:</span> In connection with a merger,
                  acquisition, reorganization, or sale of assets, your information may be transferred as
                  part of that transaction, subject to the same or equivalent privacy commitments.
                </li>
              </ul>
              <p className="mt-2">
                We do <span className="font-semibold">not</span> sell personal information for monetary
                consideration.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Data Retention</span>
              </h3>
              <p>
                We retain information only for as long as necessary to fulfill the purposes described in
                this policy, unless a longer retention period is required or permitted by law (for
                example, for legal, accounting, or compliance reasons). On-chain data is stored on public
                blockchains and cannot be altered or deleted by us.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Security</span>
              </h3>
              <p>
                We use reasonable technical and organizational measures to help protect information
                processed through the Interface. However, no online service or transmission method is
                completely secure, and we cannot guarantee absolute security. You are responsible for
                maintaining the security of your devices and wallet credentials.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Your Rights and Choices</span>
              </h3>
              <p className="mb-2">
                Depending on your location, you may have certain rights regarding your personal
                information, such as rights to access, correct, or delete certain data, or to object to
                or restrict certain processing. To exercise these rights, please contact us using the
                information below. We may need to verify your identity before responding to certain
                requests.
              </p>
              <p>
                Note that we may not be able to modify or delete information that is stored on public
                blockchains or that we are legally required to retain.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>International Data Transfers</span>
              </h3>
              <p>
                The Interface may be operated from and backed by infrastructure in multiple countries.
                This means information may be transferred to, and processed in, jurisdictions that may
                have different data protection laws than your own. By using the Interface, you consent to
                such transfers, subject to applicable law.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Changes to This Policy</span>
              </h3>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the
                &quot;Last updated&quot; date at the top of this page. Continued use of the Interface
                after any changes become effective means you accept the revised policy.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Contact Us</span>
              </h3>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, you
                can contact us at:{' '}
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

