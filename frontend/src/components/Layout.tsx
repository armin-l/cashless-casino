import BalanceBar from './BalanceBar';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col">
      <header className="sticky top-0 z-50 bg-gray-950 bg-opacity-80 backdrop-blur-sm border-b border-yellow-600 border-opacity-20 px-6 py-3 flex items-center justify-between gap-4">
        <h1 className="text-xl font-extrabold tracking-tight text-yellow-400">Cashless Casino</h1>
        <BalanceBar />
      </header>

      <nav className="bg-gray-950 bg-opacity-60 border-b border-yellow-600 border-opacity-10 px-6 py-2 flex gap-6 text-sm text-gray-400">
        <a href="/" className="hover:text-yellow-300 transition-colors cursor-pointer">Home</a>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">{children}</main>

      <footer className="text-center text-gray-600 text-sm pb-4 px-6">
        <p>All currency is simulated virtual credit (VC). No real money involved.</p>
      </footer>
    </div>
  );
}
