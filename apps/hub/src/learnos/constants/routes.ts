// src/constants/routes.ts

export const ROUTES = {
  HOME: '/',
  FAMILY_HOME: '/home',
  // Worlds
  TINY: '/tiny',
  EARLY: '/early',
  LAB: '/lab',
  DISCOVERY: '/discovery',
  ACADEMY: '/academy',
  EXPLORER: '/explorer',
  // Cross-cutting
  DAILY_WARMUP: '/warmup',
  MISTAKE_MUSEUM: '/museum',
  TEACH_ME: '/teach',
  TIME_CAPSULE: '/capsule',
  CONCEPT_GOSSIP: '/gossip',
  // Info
  WONDER_WALL: '/wonder-wall',
  IMPACT: '/impact',
  ABOUT: '/about',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
