import { useState } from 'react';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  totalWins: number;
  rank: number;
}

type TimePeriod = 'allTime' | 'today' | 'session';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<TimePeriod>('allTime');
  
  // Mock data - real implementation will fetch from API/WebSocket
  const mockData: Record<TimePeriod, LeaderboardEntry[]> = {
    allTime: [
      { userId: '1', userName: 'HighRoller99', totalWins: 150000, rank: 1 },
      { userId: '2', userName: 'LuckySpin', totalWins: 120000, rank: 2 },
      { userId: '3', userName: 'NeonPlayer', totalWins: 95000, rank: 3 },
    ],
    today: [
      { userId: '4', userName: 'DailyWin', totalWins: 15000, rank: 1 },
      { userId: '5', userName: 'QuickSpin', totalWins: 12000, rank: 2 },
      { userId: '6', userName: 'CasinoKing', totalWins: 8000, rank: 3 },
    ],
    session: [
      { userId: '7', userName: 'SessionPro', totalWins: 5000, rank: 1 },
      { userId: '8', userName: 'FastPlay', totalWins: 3200, rank: 2 },
      { userId: '9', userName: 'CasinoFan', totalWins: 2100, rank: 3 },
    ],
  };

  const currentData = mockData[activeTab];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
        {(['allTime', 'today', 'session'] as TimePeriod[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab === 'allTime' ? 'All Time' : tab === 'today' ? 'Today' : 'Session'}
          </button>
        ))}
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-3">
        {currentData.map((entry, index) => (
          <div
            key={entry.userId}
            className={`flex items-center justify-between p-4 rounded-lg bg-gray-900 border ${
              entry.userId === 'me' ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                #{entry.rank}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {entry.userName[0]}
              </div>
              <span className="text-white font-semibold">{entry.userName}</span>
            </div>
            <span className="text-yellow-400 font-mono font-bold tabular-nums">
              {(entry.totalWins / 1000).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
