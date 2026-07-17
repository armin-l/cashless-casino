import { useState } from 'react';

interface WithdrawModalProps {
  balance: number;
  onClose?: () => void;
}

export default function WithdrawModal({ balance, onClose }: WithdrawModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'bank' | 'crypto'>('bank');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = () => {
    if (!amount || parseInt(amount) <= 0 || parseInt(amount) > balance) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setShowSuccess(true);
      setStep(3);
      
      setTimeout(() => {
        onClose?.();
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
        <div className="bg-gray-900 border-4 border-green-500 rounded-3xl p-12 text-center animate-bounce shadow-[0_0_40px_rgba(34,197,94,0.5)]">
          <h2 className="text-6xl font-extrabold text-green-400 mb-4 drop-shadow-lg">
            SUCCESS!
          </h2>
          <div className="text-white text-4xl font-mono tabular-nums my-8">
            -{parseInt(amount).toLocaleString()} VC
          </div>
          <p className="text-gray-400">Withdrawal processing!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <div className="bg-gray-900 border-4 border-yellow-500 rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Withdraw Credits</h2>
        
        {/* Step 1: Amount Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-gray-300 font-semibold">Available Balance: {balance.toLocaleString()} VC</label>
            <input
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={balance}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-yellow-500"
            />
            
            <div className="flex gap-2">
              {[100, 500, balance].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                    amount === val.toString() 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setStep(2)}
              disabled={!amount || parseInt(amount) <= 0 || parseInt(amount) > balance}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Withdrawal Method */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-gray-300 font-semibold">Choose Withdrawal Method:</label>
            
            <button
              onClick={() => setMethod('bank')}
              className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all flex items-center gap-3 ${
                method === 'bank' 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              🏦 Bank Transfer (3-5 days)
            </button>
            
            <button
              onClick={() => setMethod('crypto')}
              className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all flex items-center gap-3 ${
                method === 'crypto' 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              ₿ Crypto (Instant)
            </button>

            {method === 'crypto' && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <label className="block text-sm text-gray-300 mb-2">Wallet Address:</label>
                <input 
                  placeholder="Enter your wallet address" 
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isProcessing}
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
