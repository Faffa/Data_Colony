/**
 * Core type definitions for Data Colony game
 */

/**
 * Resource types in the game
 */
export interface Resources {
  cpu: number;
  storage: number;
  quality: number;
  throughput: number;
}

/**
 * Resource production/consumption rates
 */
export interface ResourceRates {
  cpuRate: number;
  storageRate: number;
  qualityRate: number;
  throughputRate: number;
}

/**
 * Adjacency bonus rule
 */
export interface AdjacencyRule {
  targetBuildingId: string;
  modifier: Partial<ResourceRates>;
  description?: string;
}

/**
 * Building definition
 */
export interface Building {
  id: string;
  name: string;
  icon: string; // emoji
  description: string;
  cost: Partial<Resources>;
  production: Partial<Resources>;
  consumption: Partial<Resources>;
  adjacencyRules: AdjacencyRule[];
  specialProduction?: {
    resourceType: keyof Resources;
    amount: number;
    interval: number; // in seconds
  };
}

/**
 * Grid cell position
 */
export interface GridPosition {
  x: number;
  y: number;
}

/**
 * Grid cell state
 */
export interface GridCell {
  position: GridPosition;
  buildingId: string | null;
}

/**
 * Game state
 */
export interface GameState {
  resources: Resources;
  resourceRates: ResourceRates;
  grid: GridCell[][];
  timeRemaining: number; // in seconds
  gameStarted: boolean;
  gameEnded: boolean;
  score: number;
  servicesProduced: number;
}

/**
 * Game configuration
 */
export interface GameConfig {
  gridSize: number;
  gameDuration: number; // in seconds
  tickInterval: number; // in milliseconds
  startingResources: Resources;
}

/**
 * Score breakdown
 */
export interface ScoreBreakdown {
  services: number;
  quality: number;
  throughput: number;
  total: number;
}
