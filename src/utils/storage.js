/**
 * LocalStorage utility for saving/loading game progress
 */

const STORAGE_KEY = 'mindbattle_player';

const DEFAULT_PLAYER = {
  name: '',
  avatarColor: '#e63946',
  level: 1,
  xp: 0,
  coins: 0,
  wins: 0,
  losses: 0,
  npcsDefeated: [],
  bestStreak: 0,
  totalCorrectAnswers: 0,
  badges: [],
  setupComplete: false
};

export function loadPlayer() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_PLAYER, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load player data:', e);
  }
  return { ...DEFAULT_PLAYER };
}

export function savePlayer(playerData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData));
  } catch (e) {
    console.error('Failed to save player data:', e);
  }
}

export function updatePlayer(updates) {
  const current = loadPlayer();
  const updated = { ...current, ...updates };
  savePlayer(updated);
  return updated;
}

export function resetPlayer() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_PLAYER };
}

export function isNPCDefeated(npcId) {
  const player = loadPlayer();
  return player.npcsDefeated.includes(npcId);
}

export function markNPCDefeated(npcId) {
  const player = loadPlayer();
  if (!player.npcsDefeated.includes(npcId)) {
    player.npcsDefeated.push(npcId);
    savePlayer(player);
  }
  return player;
}

export function addBadge(badge) {
  const player = loadPlayer();
  if (!player.badges.find(b => b.id === badge.id)) {
    player.badges.push(badge);
    savePlayer(player);
  }
  return player;
}
