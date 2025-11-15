import { GridPosition, ResourceRates } from '../types';
import { GridManager } from '../managers/GridManager';
import { BuildingManager, PlacedBuilding } from '../managers/BuildingManager';
import { BuildingRegistry } from '../managers/BuildingRegistry';

/**
 * AdjacencyEngine - Calculates and applies adjacency bonuses
 */
export class AdjacencyEngine {
  private gridManager: GridManager;
  private buildingManager: BuildingManager;
  private registry: BuildingRegistry;

  constructor(gridManager: GridManager, buildingManager: BuildingManager) {
    this.gridManager = gridManager;
    this.buildingManager = buildingManager;
    this.registry = BuildingRegistry.getInstance();
  }

  /**
   * Calculate total resource rates including adjacency bonuses
   */
  public calculateRatesWithAdjacency(): ResourceRates {
    const rates: ResourceRates = {
      cpuRate: 0,
      storageRate: 0,
      qualityRate: 0,
      throughputRate: 0,
    };

    const placedBuildings = this.buildingManager.getPlacedBuildings();

    for (const placedBuilding of placedBuildings) {
      // Add base production
      this.addProduction(rates, placedBuilding);

      // Subtract consumption
      this.subtractConsumption(rates, placedBuilding);

      // Apply adjacency bonuses
      this.applyAdjacencyBonuses(rates, placedBuilding);
    }

    return rates;
  }

  /**
   * Add building's base production to rates
   */
  private addProduction(rates: ResourceRates, placedBuilding: PlacedBuilding): void {
    const { building } = placedBuilding;

    if (building.production.cpu) {
      rates.cpuRate += building.production.cpu;
    }
    if (building.production.storage) {
      rates.storageRate += building.production.storage;
    }
    if (building.production.quality) {
      rates.qualityRate += building.production.quality;
    }
    if (building.production.throughput) {
      rates.throughputRate += building.production.throughput;
    }
  }

  /**
   * Subtract building's consumption from rates
   */
  private subtractConsumption(rates: ResourceRates, placedBuilding: PlacedBuilding): void {
    const { building } = placedBuilding;

    if (building.consumption.cpu) {
      rates.cpuRate -= building.consumption.cpu;
    }
    if (building.consumption.storage) {
      rates.storageRate -= building.consumption.storage;
    }
    if (building.consumption.quality) {
      rates.qualityRate -= building.consumption.quality;
    }
    if (building.consumption.throughput) {
      rates.throughputRate -= building.consumption.throughput;
    }
  }

  /**
   * Apply adjacency bonuses for a building
   */
  private applyAdjacencyBonuses(rates: ResourceRates, placedBuilding: PlacedBuilding): void {
    const { building, position } = placedBuilding;

    // Get neighbors
    const neighbors = this.gridManager.getNeighbors(position);

    // Check each adjacency rule
    for (const rule of building.adjacencyRules) {
      // Count how many neighbors match this rule
      const matchingNeighbors = neighbors.filter(
        (neighbor) => neighbor.buildingId === rule.targetBuildingId
      );

      if (matchingNeighbors.length > 0) {
        // Apply modifier for each matching neighbor
        for (let i = 0; i < matchingNeighbors.length; i++) {
          if (rule.modifier.cpuRate) {
            // Get base production for this building
            const baseProduction = building.production.cpu || 0;
            rates.cpuRate += baseProduction * rule.modifier.cpuRate;
          }
          if (rule.modifier.storageRate) {
            rates.storageRate += rule.modifier.storageRate;
          }
          if (rule.modifier.qualityRate) {
            rates.qualityRate += rule.modifier.qualityRate;
          }
          if (rule.modifier.throughputRate) {
            const baseProduction = building.production.throughput || 0;
            rates.throughputRate += baseProduction * rule.modifier.throughputRate;
          }
        }
      }
    }
  }

  /**
   * Get adjacency info for a specific position (for UI tooltips)
   */
  public getAdjacencyInfo(position: GridPosition): string[] {
    const info: string[] = [];
    const placedBuilding = this.buildingManager.getBuildingAt(position);

    if (!placedBuilding) {
      return info;
    }

    const { building } = placedBuilding;
    const neighbors = this.gridManager.getNeighbors(position);

    for (const rule of building.adjacencyRules) {
      const matchingNeighbors = neighbors.filter(
        (neighbor) => neighbor.buildingId === rule.targetBuildingId
      );

      if (matchingNeighbors.length > 0) {
        const targetBuilding = this.registry.getBuilding(rule.targetBuildingId);
        if (targetBuilding && rule.description) {
          info.push(`${rule.description} (${matchingNeighbors.length}x ${targetBuilding.icon})`);
        }
      }
    }

    return info;
  }

  /**
   * Get all positions that have active adjacency bonuses
   */
  public getActiveAdjacencyPositions(): Set<string> {
    const activePositions = new Set<string>();
    const placedBuildings = this.buildingManager.getPlacedBuildings();

    for (const placedBuilding of placedBuildings) {
      const { building, position } = placedBuilding;
      const neighbors = this.gridManager.getNeighbors(position);

      // Check if this building has any active adjacency bonuses
      for (const rule of building.adjacencyRules) {
        const hasMatch = neighbors.some(
          (neighbor) => neighbor.buildingId === rule.targetBuildingId
        );
        if (hasMatch) {
          const key = `${position.x},${position.y}`;
          activePositions.add(key);
          break;
        }
      }
    }

    return activePositions;
  }
}
