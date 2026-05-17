/**
 * Map Data
 * 0 = walkable grass
 * 1 = wall/obstacle (tree/rock)
 * 2 = water (not walkable)
 * 3 = path/road
 * 4 = building
 * 5 = bridge
 */

export const TILE_SIZE = 48;
export const MAP_COLS = 18;
export const MAP_ROWS = 14;

// Visual tile types for rendering
export const TILE_TYPES = {
  0: { name: 'grass', walkable: true, color: '#2d6a4f' },
  1: { name: 'tree', walkable: false, color: '#1b4332' },
  2: { name: 'water', walkable: false, color: '#023e8a' },
  3: { name: 'path', walkable: true, color: '#8d6e63' },
  4: { name: 'building', walkable: false, color: '#4a4e69' },
  5: { name: 'bridge', walkable: true, color: '#bc6c25' },
  6: { name: 'flowers', walkable: true, color: '#55a630' },
  7: { name: 'sand', walkable: true, color: '#dda15e' },
};

export const mapData = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 3, 3, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 6, 3, 0, 0, 6, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1],
  [1, 0, 0, 3, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 1],
  [1, 3, 3, 3, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 1],
  [1, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 2, 2, 0, 3, 0, 0, 1],
  [1, 0, 0, 3, 3, 3, 3, 3, 5, 3, 0, 2, 2, 0, 3, 0, 6, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 1],
  [1, 0, 6, 0, 1, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 7, 7, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 6, 0, 7, 0, 3, 0, 0, 6, 0, 1, 0, 0, 1],
  [1, 0, 0, 6, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 6, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export function isTileWalkable(x, y) {
  if (x < 0 || x >= MAP_COLS || y < 0 || y >= MAP_ROWS) return false;
  const tileId = mapData[y][x];
  return TILE_TYPES[tileId]?.walkable ?? false;
}
