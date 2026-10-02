export const APP_NAME = 'Skomma';

export const DEFAULT_API_URL = 'http://localhost:3000/api/v1';
export const DEFAULT_WS_URL = 'ws://localhost:3000/api/v1';

export const ROUTES = {
  splash: '/',
  login: '/login',
  register: '/register',
  home: '/home',
  marketplace: '/marketplace',
  inventory: '/inventory',
  orders: '/orders',
  profile: '/profile',
  settings: '/settings',
  chat: '/chat',
  worldLoading: '/world/loading',
  world: '/world',
} as const;

export const WORLD = {
  tileSize: 32,
  viewDistance: 10,
  playerSpeed: 200,
  npcCap: 64,
  vehicleCap: 32,
} as const;
