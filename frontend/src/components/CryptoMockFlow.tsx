'use client';

import React, { useState } from 'react';

/**
 * CryptoMockFlow — fake crypto deposit flow with address + QR code placeholder.
 * 
 * Shows a simulated cryptocurrency deposit address that users can copy.
 * Includes a QR code placeholder for scanning.
 */

type Props = {
  onCopy?: (success: boolean) => void;
};

const FAKE_ADDRESSES = [
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Bitcoin
  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', // Ethereum
  'Rn8KqJzYvXwE2mPcDfGhTkLpWsQaVbYuIr', // Ripple
];

export default function CryptoMockFlow({ onCopy }: Props) {
  const [selectedAddress, setSelectedAddress] = useState(FAKE_ADDRESSES[0]);
  const [copied, setCopied] = useState(false);
  const [network, setNetwork] = useState<'BTC' | 'ETH' | 'XRP'>('BTC');

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(selectedAddress).then(() => {
      setCopied(true);
      onCopy?.(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback: select text for manual copy
      const textarea = document.createElement('textarea');
      textarea.value = selectedAddress;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      onCopy?.(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Network selector */}
      <div className="flex justify-center gap-2">
        {(['BTC', 'ETH', 'XRP'] as const).map(n => (
          <button
            key={n}
            onClick={() => setNetwork(n)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              network === n
                ? 'bg-yellow-500 text-black font-bold'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* QR Code Placeholder */}
      <div className="flex justify-center">
        <div className="w-48 h-48 bg-white rounded-xl p-4 flex items-center justify-center border-2 border-gray-700">
          <div className="grid grid-cols-5 gap-1 w-full">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`aspect-square rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Address display */}
      <div className="bg-gray-900/80 rounded-xl p-4 border border-yellow-600/30">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your {network} Address</p>
        
        <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-2">
          <code className="flex-1 text-sm font-mono truncate text-green-400 select-all">
            {selectedAddress}
          </code>
          
          <button
            onClick={copyToClipboard}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-colors ${
              copied ? 'bg-green-600 text-white' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        {/* Warning */}
        <p className="text-xs text-gray-600 mt-2">
          ⚠️ Only send {network === 'BTC' ? 'Bitcoin' : network === 'ETH' ? 'Ethereum' : 'Ripple'} to this address. Other cryptocurrencies may be lost permanently.
        </p>
      </div>
    </div>
  );
}
