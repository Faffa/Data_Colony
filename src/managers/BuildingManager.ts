import Phaser from 'phaser';
import { Building, GridPosition } from '../types';
import { BuildingRegistry } from './BuildingRegistry';
import { GridManager } from './GridManager';
import { ResourceEngine } from '../engine/ResourceEngine';

/**
 * Placed building instance
 */
export interface PlacedBuilding {
  building: Building;
  position: GridPosition;
  iconText?: Phaser.GameObjects.Text;
}

/**
 * BuildingManager - Manages building placement and building-related logic
 */
export class BuildingManager {
  private scene: Phaser.Scene;
  private registry: BuildingRegistry;
  private gridManager: GridManager;
  private resourceEngine: ResourceEngine;
  private placedBuildings: Map<string, PlacedBuilding>; // key: "x,y"
  private servicesProduced: number;

  constructor(
    scene: Phaser.Scene,
    gridManager: GridManager,
    resourceEngine: ResourceEngine
  ) {
    this.scene = scene;
    this.registry = BuildingRegistry.getInstance();
    this.gridManager = gridManager;
    this.resourceEngine = resourceEngine;
    this.placedBuildings = new Map();
    this.servicesProduced = 0;
  }

  /**
   * Attempt to place a building
   */
  public placeBuilding(buildingId: string, position: GridPosition): boolean {
    const building = this.registry.getBuilding(buildingId);
    if (!building) {
      console.error(`Building not found: ${buildingId}`);
      return false;
    }

    // Check if cell is empty
    const cell = this.gridManager.getCell(position);
    if (!cell || cell.buildingId) {
      console.log('Cell is occupied');
      return false;
    }

    // Check if we can afford it
    if (!this.resourceEngine.canAfford(building.cost)) {
      console.log('Cannot afford building');
      return false;
    }

    // Deduct cost
    if (!this.resourceEngine.deductResources(building.cost)) {
      return false;
    }

    // Place building on grid
    if (!this.gridManager.setBuilding(position, building.id)) {
      // Refund if placement failed
      this.resourceEngine.addResources(building.cost);
      return false;
    }

    // Create building icon
    const iconText = this.createBuildingIcon(building, position);

    // Store placed building
    const key = `${position.x},${position.y}`;
    this.placedBuildings.set(key, {
      building,
      position,
      iconText,
    });

    // Add placement effect
    this.createPlacementEffect(position);

    console.log(`Placed ${building.name} at (${position.x}, ${position.y})`);
    return true;
  }

  /**
   * Create placement effect
   */
  private createPlacementEffect(position: GridPosition): void {
    const gridSize = 5;
    const cellSize = 80;
    const totalGridWidth = gridSize * cellSize;
    const totalGridHeight = gridSize * cellSize;
    const gridOffsetX = (800 - totalGridWidth) / 2;
    const gridOffsetY = (600 - totalGridHeight) / 2 + 30;

    const x = gridOffsetX + position.x * cellSize + cellSize / 2;
    const y = gridOffsetY + position.y * cellSize + cellSize / 2;

    // Create pulsing circle effect
    const circle = this.scene.add.circle(x, y, 40, 0x22c55e, 0.5);
    this.scene.tweens.add({
      targets: circle,
      scale: 1.5,
      alpha: 0,
      duration: 400,
      onComplete: () => circle.destroy(),
    });
  }

  /**
   * Create building icon visual
   */
  private createBuildingIcon(building: Building, position: GridPosition): Phaser.GameObjects.Text {
    // Calculate position (grid offset + cell center)
    const gridSize = 5; // Should match GridManager
    const cellSize = 80;
    const totalGridWidth = gridSize * cellSize;
    const totalGridHeight = gridSize * cellSize;
    const gridOffsetX = (800 - totalGridWidth) / 2;
    const gridOffsetY = (600 - totalGridHeight) / 2 + 30;

    const x = gridOffsetX + position.x * cellSize + cellSize / 2;
    const y = gridOffsetY + position.y * cellSize + cellSize / 2;

    const iconText = this.scene.add.text(x, y, building.icon, {
      fontSize: '40px',
    });
    iconText.setOrigin(0.5);

    return iconText;
  }

  /**
   * Calculate total production/consumption from all buildings
   */
  public calculateResourceRates(): void {
    let cpuRate = 0;
    let storageRate = 0;
    let qualityRate = 0;
    let throughputRate = 0;

    for (const [, placedBuilding] of this.placedBuildings) {
      const { building } = placedBuilding;

      // Add production
      if (building.production.cpu) cpuRate += building.production.cpu;
      if (building.production.storage) storageRate += building.production.storage;
      if (building.production.quality) qualityRate += building.production.quality;
      if (building.production.throughput) throughputRate += building.production.throughput;

      // Subtract consumption
      if (building.consumption.cpu) cpuRate -= building.consumption.cpu;
      if (building.consumption.storage) storageRate -= building.consumption.storage;
      if (building.consumption.quality) qualityRate -= building.consumption.quality;
      if (building.consumption.throughput) throughputRate -= building.consumption.throughput;
    }

    // Update resource engine
    this.resourceEngine.setResourceRates({
      cpuRate,
      storageRate,
      qualityRate,
      throughputRate,
    });
  }

  /**
   * Get all placed buildings
   */
  public getPlacedBuildings(): PlacedBuilding[] {
    return Array.from(this.placedBuildings.values());
  }

  /**
   * Get building at position
   */
  public getBuildingAt(position: GridPosition): PlacedBuilding | undefined {
    const key = `${position.x},${position.y}`;
    return this.placedBuildings.get(key);
  }

  /**
   * Remove a building and refund 50% of its cost
   */
  public removeBuilding(position: GridPosition): boolean {
    const key = `${position.x},${position.y}`;
    const placedBuilding = this.placedBuildings.get(key);

    if (!placedBuilding) {
      console.log('No building at this position');
      return false;
    }

    const { building, iconText } = placedBuilding;

    // Calculate 50% refund
    const refund = {
      cpu: Math.floor((building.cost.cpu || 0) / 2),
      storage: Math.floor((building.cost.storage || 0) / 2),
      quality: Math.floor((building.cost.quality || 0) / 2),
      throughput: Math.floor((building.cost.throughput || 0) / 2),
    };

    // Refund resources
    this.resourceEngine.addResources(refund);

    // Remove visual
    if (iconText) {
      iconText.destroy();
    }

    // Remove from grid
    this.gridManager.setBuilding(position, null);

    // Remove from placed buildings
    this.placedBuildings.delete(key);

    // Add removal effect
    this.createRemovalEffect(position);

    console.log(`Removed ${building.name} at (${position.x}, ${position.y}), refunded 50%`);
    return true;
  }

  /**
   * Create removal effect
   */
  private createRemovalEffect(position: GridPosition): void {
    const gridSize = 5;
    const cellSize = 80;
    const totalGridWidth = gridSize * cellSize;
    const totalGridHeight = gridSize * cellSize;
    const gridOffsetX = (800 - totalGridWidth) / 2;
    const gridOffsetY = (600 - totalGridHeight) / 2 + 30;

    const x = gridOffsetX + position.x * cellSize + cellSize / 2;
    const y = gridOffsetY + position.y * cellSize + cellSize / 2;

    // Create fading circle effect
    const circle = this.scene.add.circle(x, y, 40, 0xef4444, 0.5);
    this.scene.tweens.add({
      targets: circle,
      scale: 0.5,
      alpha: 0,
      duration: 300,
      onComplete: () => circle.destroy(),
    });
  }

  /**
   * Get services produced count
   */
  public getServicesProduced(): number {
    return this.servicesProduced;
  }

  /**
   * Increment services (called by Service Gateway)
   */
  public incrementServices(amount: number = 1): void {
    this.servicesProduced += amount;
  }

  /**
   * Clear all buildings
   */
  public clear(): void {
    // Remove all icon visuals
    for (const [, placedBuilding] of this.placedBuildings) {
      if (placedBuilding.iconText) {
        placedBuilding.iconText.destroy();
      }
    }

    this.placedBuildings.clear();
    this.servicesProduced = 0;
    this.gridManager.clear();
  }
}
