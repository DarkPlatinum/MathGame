/**
 * NPC Data
 * Contains all NPC definitions for the overworld
 */

export const npcs = [
  {
    id: 'rookie_rohan',
    name: 'Rookie Rohan',
    difficulty: 'easy',
    hp: 60,
    dialogue: "Let's see if your basics are strong!",
    position: { x: 5, y: 3 },
    color: '#4cc9f0',
    badge: {
      id: 'basics_badge',
      name: 'Basics Master',
      icon: '🥉',
      description: 'Defeated Rookie Rohan'
    }
  },
  {
    id: 'quick_mira',
    name: 'Quick Mira',
    difficulty: 'medium',
    hp: 80,
    dialogue: 'Speed matters more than confidence!',
    position: { x: 12, y: 7 },
    color: '#f72585',
    badge: {
      id: 'speed_badge',
      name: 'Speed Demon',
      icon: '🥈',
      description: 'Defeated Quick Mira'
    }
  },
  {
    id: 'prof_aryan',
    name: 'Professor Aryan',
    difficulty: 'hard',
    hp: 120,
    dialogue: 'Only sharp minds survive this battle.',
    position: { x: 8, y: 11 },
    color: '#7209b7',
    badge: {
      id: 'genius_badge',
      name: 'Math Genius',
      icon: '🥇',
      description: 'Defeated Professor Aryan'
    }
  },
  {
    id: 'tricky_tina',
    name: 'Tricky Tina',
    difficulty: 'medium',
    hp: 90,
    dialogue: "Don't let the numbers fool you!",
    position: { x: 3, y: 10 },
    color: '#f4a261',
    badge: {
      id: 'tricky_badge',
      name: 'Puzzle Solver',
      icon: '🧩',
      description: 'Defeated Tricky Tina'
    }
  },
  {
    id: 'boss_khan',
    name: 'Boss Khan',
    difficulty: 'hard',
    hp: 150,
    dialogue: 'I am the ultimate math warrior. Prepare yourself!',
    position: { x: 14, y: 2 },
    color: '#d00000',
    badge: {
      id: 'champion_badge',
      name: 'Arena Champion',
      icon: '👑',
      description: 'Defeated Boss Khan'
    }
  }
];

export function getNPCById(id) {
  return npcs.find(npc => npc.id === id);
}
