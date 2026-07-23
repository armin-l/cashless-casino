'use client';

import React, { useState, useRef, useCallback } from 'react';

/**
 * ChipPlacement — drag chips onto a betting grid for roulette.
 * 
 * Users drag physical-looking chips onto numbered cells in the
 * roulette betting layout. Chips snap into place and stack visually.
 */

type ChipValue = 1 | 5 | 10 | 25 | 50 | 100;
type PlacementCell = { row: number; col: number };

interface PlacedChip {
  id: string;
  value: ChipValue;
  cell: PlacementCell;
}

const CHIP_COLORS: Record<ChipValue, string> = {
  1: 'bg-gray-300 border-gray-400 text-gray-800',
  5: 'bg-blue-600 border-blue-700 text-white',
  10: 'bg-red-600 border-red-700 text-white',
  25: 'bg-green-600 border-green-700 text-white',
  50: 'bg-purple-600 border-purple-700 text-white',
  100: 'bg-black border-yellow-500 text-yellow-400',
};

const CHIP_VALUES: ChipValue[] = [1, 5, 10, 25, 50, 100];

export default function ChipPlacement({ onPlace }: { onPlace?: (chip: PlacedChip) => void }) {
  const [placedChips, setPlacedChips] = useState<PlacedChip[]>([]);
  const [selectedValue, setSelectedValue] = useState<ChipValue>(10);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('chipValue', String(selectedValue));
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  }, [selectedValue]);

  const handleDrop = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const value = parseInt(e.dataTransfer.getData('chipValue') || String(selectedValue));
    
    // Find the cell being dropped on
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Grid is 10x7 (numbers 0-36 + outside bets)
    const col = Math.floor(x / (rect.width / 10));
    const row = Math.floor(y / (rect.height / 7));
    
    if (col < 0 || col >= 10 || row < 0 || row >= 7) return;
    
    const chip: PlacedChip = {
      id: `chip-${Date.now()}`,
      value,
      cell: { row, col },
    };
    
    setPlacedChips(prev => [...prev, chip]);
    onPlace?.(chip);
  }, [selectedValue, onPlace]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Chip selector bar */}
      <div className="flex items-center justify-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-800">
        <span className="text-xs text-gray-500 uppercase tracking-wider mr-2">Select</span>
        {CHIP_VALUES.map(value => (
          <div
            key={value}
            draggable
            onDragStart={handleDragStart}
            onClick={() => setSelectedValue(value)}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm cursor-grab active:cursor-grabbing select-none border-4 shadow-lg transition-transform hover:scale-105 ${CHIP_COLORS[value]} ${selectedValue === value ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900 scale-110' : ''}`}
            style={{ boxShadow: `inset 0 -3px 6px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.5)` }}
          >
            {value}
          </div>
        ))}
      </div>

      {/* Betting grid */}
      <div 
        className="relative w-full max-w-lg mx-auto aspect-[10/7] bg-green-900/30 rounded-xl border-2 border-yellow-600/50 p-4"
        onDrop={handleDragOver}
        onDragOver={handleDragOver}
      >
        {/* Grid cells */}
        <div className="grid grid-cols-10 grid-rows-7 h-full gap-1">
          {[...Array(70)].map((_, i) => {
            const col = i % 10;
            const row = Math.floor(i / 10);
            const num = row === 0 ? 0 : (row * 3 + col) % 37;
            const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num);
            
            return (
              <div key={i} className={`relative rounded border border-white/10 flex items-center justify-center text-xs font-bold ${num === 0 ? 'bg-green-800' : isRed ? 'bg-red-900/60' : 'bg-gray-900/60'} hover:bg-yellow-500/20 transition-colors`}>
                {num}
              </div>
            );
          })}
        </div>

        {/* Placed chips */}
        {placedChips.map(chip => (
          <div
            key={chip.id}
            className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer border-2 shadow-lg ${CHIP_COLORS[chip.value]}`}
            style={{ 
              left: `${(chip.cell.col / 10) * 100 + 5}%`, 
              top: `${(chip.cell.row / 7) * 100 + 5}%`
            }}
            onClick={() => setPlacedChips(prev => prev.filter(c => c.id !== chip.id))}
          >
            {chip.value}
          </div>
        ))}

        {/* Total bet display */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
          Bet: {placedChips.reduce((sum, c) => sum + c.value, 0)} VC
        </div>
      </div>

      {/* Clear all button */}
      {placedChips.length > 0 && (
        <button
          onClick={() => setPlacedChips([])}
          className="mx-auto px-6 py-2 bg-red-900/50 hover:bg-red-800/70 text-red-300 rounded-lg border border-red-700/50 transition-colors"
        >
          Clear Bets
        </button>
      )}
    </div>
  );
}
