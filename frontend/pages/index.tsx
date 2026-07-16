export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Cashless Casino
          </h1>
          <p className="text-gray-400 text-lg">Play. Win. Enjoy — all with virtual credits.</p>
        </header>

        {/* Game Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a href="/games/slots" className="group block">
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600 border-opacity-20 rounded-2xl p-8 text-center hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 transition-all cursor-pointer">
              <div className="text-5xl mb-4 group-hover:animate-bounce">🎰</div>
              <h2 className="text-xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300">Slots</h2>
              <p className="text-gray-400 text-sm">Classic 3-reel action with big win potential.</p>
            </div>
          </a>

          <a href="/games/roulette" className="group block">
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600 border-opacity-20 rounded-2xl p-8 text-center hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 transition-all cursor-pointer">
              <div className="text-5xl mb-4 group-hover:animate-bounce">🎡</div>
              <h2 className="text-xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300">Roulette</h2>
              <p className="text-gray-400 text-sm">European single-zero wheel with all bet types.</p>
            </div>
          </a>

          <a href="/games/blackjack" className="group block">
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600 border-opacity-20 rounded-2xl p-8 text-center hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 transition-all cursor-pointer">
              <div className="text-5xl mb-4 group-hover:animate-bounce">🃏</div>
              <h2 className="text-xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300">Blackjack</h2>
              <p className="text-gray-400 text-sm">6-deck shoe. Beat the dealer to 21.</p>
            </div>
          </a>
        </section>

        {/* Stats Bar */}
        <section className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-yellow-600 border-opacity-20 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 text-xl font-extrabold tracking-wider">VC</span>
            <span className="text-white text-3xl font-mono tabular-nums" data-testid="balance-display">1,000.00</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-sm mt-16 pb-8">
          <p>All currency is simulated virtual credit (VC). No real money involved.</p>
        </footer>
      </div>
    </main>
  );
}
