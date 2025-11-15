import { Building } from '../types';
import buildingsData from '../config/buildings.json';

/**
 * BuildingRegistry - Central registry for all building definitions
 */
export class BuildingRegistry {
  private static instance: BuildingRegistry;
  private buildings: Map<string, Building>;

  private constructor() {
    this.buildings = new Map();
    this.loadBuildings();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): BuildingRegistry {
    if (!BuildingRegistry.instance) {
      BuildingRegistry.instance = new BuildingRegistry();
    }
    return BuildingRegistry.instance;
  }

  /**
   * Load buildings from JSON
   */
  private loadBuildings(): void {
    const buildingArray = buildingsData as Building[];
    
    for (const building of buildingArray) {
      this.buildings.set(building.id, building);
    }

    console.log(`Loaded ${this.buildings.size} building types`);
  }

  /**
   * Get building by ID
   */
  public getBuilding(id: string): Building | undefined {
    return this.buildings.get(id);
  }

  /**
   * Get all buildings
   */
  public getAllBuildings(): Building[] {
    return Array.from(this.buildings.values());
  }

  /**
   * Get buildings by filter
   */
  public getBuildingsByFilter(filter: (building: Building) => boolean): Building[] {
    return this.getAllBuildings().filter(filter);
  }

  /**
   * Check if building exists
   */
  public hasBuilding(id: string): boolean {
    return this.buildings.has(id);
  }
}
