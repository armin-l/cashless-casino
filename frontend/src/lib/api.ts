const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export function getBalance(userId = 'user123') {
  return fetch(`${BASE_URL}/wallet/balance?user_id=${encodeURIComponent(userId)}`).then(checkStatus);
}

export function depositFunds(amount, userId = 'user123', method = 'mock_card') {
  return fetch(`${BASE_URL}/economy/deposit?amount=${amount}&user_id=${encodeURIComponent(userId)}&method=${method}`, { method: 'POST' });
}

const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣'];

export function spinSlots(betAmount, userId = 'user123') {
  return fetch(`${BASE_URL}/games/slots/spin?bet_amount=${betAmount}&user_id=${encodeURIComponent(userId)}&reel_count=3`, { method: 'POST' })
    .then(checkStatus)
    .then(data => ({ ...data, reels: Array.isArray(data.reels) ? data.reels : SYMBOLS.slice(0, 3) }));
}

export function spinRoulette(betType, betAmount, userId = 'user123', betNumber = null, betParameter = null) {
  let url = `${BASE_URL}/games/roulette/spin?bet_type=${encodeURIComponent(betType)}&bet_amount=${betAmount}&user_id=${encodeURIComponent(userId)}`;
  if (betNumber !== null) url += `&bet_number=${betNumber}`;
  if (betParameter !== null) url += `&bet_parameter=${betParameter}`;
  return fetch(url, { method: 'POST' }).then(checkStatus);
}

export function dealBlackjack(betAmount = 25.0, userId = 'user123') {
  let url = `${BASE_URL}/games/blackjack/deal?bet_amount=${betAmount}`;
  if (userId) url += `&user_id=${encodeURIComponent(userId)}`;
  return fetch(url, { method: 'POST' }).then(checkStatus);
}

export function hitBlackjack(handId) {
  return fetch(`${BASE_URL}/games/blackjack/hit?hand_id=${encodeURIComponent(handId)}`, { method: 'POST' }).then(checkStatus);
}

export function standBlackjack(handId) {
  return fetch(`${BASE_URL}/games/blackjack/stand?hand_id=${encodeURIComponent(handId)}`, { method: 'POST' }).then(checkStatus);
}

export function doubleDownBlackjack(handId) {
  return fetch(`${BASE_URL}/games/blackjack/double_down?hand_id=${encodeURIComponent(handId)}`, { method: 'POST' }).then(checkStatus);
}

function checkStatus(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const api = { getBalance, depositFunds, spinSlots, spinRoulette, dealBlackjack, hitBlackjack, standBlackjack, doubleDownBlackjack };
