import { useState } from 'react';

interface DepositModalProps {
  onClose?: () => void;
}

export default function DepositModal({ onClose }: DepositModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    if (!amount || parseInt(amount) <= 0) return;
    
    // Simulate processing
    setTimeout(() => {
      setShowSuccess(true);
      setStep(3);
      
      setTimeout(() => {
        onClose?.();
      }, 2000);
    }, 1000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
        <div className="bg-gray-900 border-4 border-green-500 rounded-3xl p-12 text-center animate-bounce shadow-[0_0_40px_rgba(34,197,94,0.5)]">
          <h2 className="text-6xl font-extrabold text-green-400 mb-4 drop-shadow-lg">
            SUCCESS!
          </h2>
          <div className="text-white text-4xl font-mono tabular-nums my-8">
            +{parseInt(amount).toLocaleString()} VC
          </div>
          <p className="text-gray-400">Credits added to your balance!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <div className="bg-gray-900 border-4 border-yellow-500 rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Deposit Credits</h2>
        
        {/* Step 1: Amount Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-gray-300 font-semibold">Select Amount:</label>
            {[100, 500, 1000, 5000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all ${
                  amount === val.toString() 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {val.toLocaleString()} VC
              </button>
            ))}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Custom amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-yellow-500"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!amount || parseInt(amount) <= 0}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-gray-300 font-semibold">Payment Method:</label>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all flex items-center gap-3 ${
                paymentMethod === 'card' 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              💳 Credit Card
            </button>
            <button
              onClick={() => setPaymentMethod('crypto')}
              className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all flex items-center gap-3 ${
                paymentMethod === 'crypto' 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              ₿ Crypto (Bitcoin)
            </button>
            
            {paymentMethod === 'card' && (
              <div className="space-y-3 mt-4 p-4 bg-gray-800 rounded-lg">
                <input placeholder="Card Number" className="w-full px-3 py-2 bg-gray-700 text-white rounded" />
                <div className="flex gap-2">
                  <input placeholder="MM/YY" className="flex-1 px-3 py-2 bg-gray-700 text-white rounded" />
                  <input placeholder="CVC" className="w-20 px-3 py-2 bg-gray-700 text-white rounded" />
                </div>
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
                onClick={handleConfirm}
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
