import { Resources, ResourceRates } from '../types';

/**
 * ResourceEngine - Manages game resources and their rates
 */
export class ResourceEngine {
  private resources: Resources;
  private resourceRates: ResourceRates;

  constructor(startingResources: Resources) {
    this.resources = { ...startingResources };
    this.resourceRates = {
      cpuRate: 0,
      storageRate: 0,
      qualityRate: 0,
      throughputRate: 0,
    };
  }

  /**
   * Get current resources
   */
  public getResources(): Resources {
    return { ...this.resources };
  }

  /**
   * Get current resource rates
   */
  public getResourceRates(): ResourceRates {
    return { ...this.resourceRates };
  }

  /**
   * Set resource rates (called by building manager)
   */
  public setResourceRates(rates: ResourceRates): void {
    this.resourceRates = { ...rates };
  }

  /**
   * Update resource rate for a specific resource
   */
  public updateResourceRate(resourceType: keyof Resources, delta: number): void {
    const rateKey = `${resourceType}Rate` as keyof ResourceRates;
    this.resourceRates[rateKey] += delta;
  }

  /**
   * Apply tick - update resources based on rates
   */
  public tick(): void {
    this.resources.cpu += this.resourceRates.cpuRate;
    this.resources.storage += this.resourceRates.storageRate;
    this.resources.quality += this.resourceRates.qualityRate;
    this.resources.throughput += this.resourceRates.throughputRate;

    // Prevent negative resources (buildings stall instead)
    this.resources.cpu = Math.max(0, this.resources.cpu);
    this.resources.storage = Math.max(0, this.resources.storage);
    this.resources.quality = Math.max(0, this.resources.quality);
    this.resources.throughput = Math.max(0, this.resources.throughput);
  }

  /**
   * Check if we can afford a cost
   */
  public canAfford(cost: Partial<Resources>): boolean {
    if (cost.cpu !== undefined && this.resources.cpu < cost.cpu) return false;
    if (cost.storage !== undefined && this.resources.storage < cost.storage) return false;
    if (cost.quality !== undefined && this.resources.quality < cost.quality) return false;
    if (cost.throughput !== undefined && this.resources.throughput < cost.throughput) return false;
    return true;
  }

  /**
   * Deduct resources (for building placement)
   */
  public deductResources(cost: Partial<Resources>): boolean {
    if (!this.canAfford(cost)) {
      return false;
    }

    if (cost.cpu !== undefined) this.resources.cpu -= cost.cpu;
    if (cost.storage !== undefined) this.resources.storage -= cost.storage;
    if (cost.quality !== undefined) this.resources.quality -= cost.quality;
    if (cost.throughput !== undefined) this.resources.throughput -= cost.throughput;

    return true;
  }

  /**
   * Add resources
   */
  public addResources(amount: Partial<Resources>): void {
    if (amount.cpu !== undefined) this.resources.cpu += amount.cpu;
    if (amount.storage !== undefined) this.resources.storage += amount.storage;
    if (amount.quality !== undefined) this.resources.quality += amount.quality;
    if (amount.throughput !== undefined) this.resources.throughput += amount.throughput;
  }

  /**
   * Reset resources to starting values
   */
  public reset(startingResources: Resources): void {
    this.resources = { ...startingResources };
    this.resourceRates = {
      cpuRate: 0,
      storageRate: 0,
      qualityRate: 0,
      throughputRate: 0,
    };
  }

  /**
   * Get a specific resource value
   */
  public getResource(type: keyof Resources): number {
    return this.resources[type];
  }

  /**
   * Get a specific resource rate
   */
  public getResourceRate(type: keyof Resources): number {
    const rateKey = `${type}Rate` as keyof ResourceRates;
    return this.resourceRates[rateKey];
  }
}
