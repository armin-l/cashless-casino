import Layout from '../src/components/Layout';
import GameCardGrid from '../src/components/GameCardGrid';
import BalanceBar from '../src/components/BalanceBar';

export default function Home() {
  return (
    <Layout>
      {/* Hero Header */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
          Cashless Casino
        </h1>
        <p className="text-gray-400 text-lg">Play. Win. Enjoy — all with virtual credits.</p>
      </header>

      {/* Game Cards Grid */}
      <GameCardGrid />

      {/* Balance Bar Section */}
      <section className="mt-8 bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600 border-opacity-20 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-xl font-extrabold tracking-wider">VC</span>
          <BalanceBar />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm mt-16 pb-8">
        <p>All currency is simulated virtual credit (VC). No real money involved.</p>
      </footer>
    </Layout>
  );
}
