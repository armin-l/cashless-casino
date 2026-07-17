export function useClickSound() {
  const play = () => {
    // Placeholder - real audio files will be added later
    console.log('click sound played');
  };

  return play;
}

export function useWinSound(winAmount: number, isJackpot: boolean) {
  const play = () => {
    if (isJackpot) {
      console.log('jackpot sound played!');
    } else {
      console.log(`win sound played for ${winAmount}`);
    }
  };

  return play;
}

export function useSpinStartSound() {
  const play = () => {
    // Placeholder - real audio files will be added later
    console.log('spin start anticipation sound');
  };

  return play;
}
