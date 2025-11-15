import Phaser from 'phaser';
import { Building } from '../types';
import { BuildingRegistry } from '../managers/BuildingRegistry';
import { ResourceEngine } from '../engine/ResourceEngine';

/**
 * BuildingMenu - UI for selecting buildings to place
 */
export class BuildingMenu {
  private scene: Phaser.Scene;
  private registry: BuildingRegistry;
  private resourceEngine: ResourceEngine;
  private container: Phaser.GameObjects.Container | null;
  private isVisible: boolean;
  private onBuildingSelected?: (buildingId: string) => void;
  private selectedPosition?: { x: number; y: number };

  constructor(scene: Phaser.Scene, resourceEngine: ResourceEngine) {
    this.scene = scene;
    this.registry = BuildingRegistry.getInstance();
    this.resourceEngine = resourceEngine;
    this.container = null;
    this.isVisible = false;
  }

  /**
   * Show menu at grid position
   */
  public show(gridX: number, gridY: number, onSelect: (buildingId: string) => void): void {
    if (this.isVisible) {
      this.hide();
    }

    this.selectedPosition = { x: gridX, y: gridY };
    this.onBuildingSelected = onSelect;
    this.isVisible = true;

    this.createMenu();
  }

  /**
   * Hide menu
   */
  public hide(): void {
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
    this.isVisible = false;
    this.onBuildingSelected = undefined;
    this.selectedPosition = undefined;
  }

  /**
   * Create menu UI
   */
  private createMenu(): void {
    const menuWidth = 400;
    const menuHeight = 500;
    const menuX = 400; // Center of screen
    const menuY = 300;

    this.container = this.scene.add.container(menuX, menuY);
    this.container.setDepth(1000); // On top of everything

    // Background
    const bg = this.scene.add.rectangle(0, 0, menuWidth, menuHeight, 0x1e293b, 0.98);
    bg.setStrokeStyle(2, 0x3b82f6);
    this.container.add(bg);

    // Title
    const title = this.scene.add.text(0, -menuHeight / 2 + 20, 'SELECT BUILDING', {
      fontSize: '20px',
      color: '#3b82f6',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);
    this.container.add(title);

    // Close button
    const closeBtn = this.scene.add.text(menuWidth / 2 - 20, -menuHeight / 2 + 20, '✕', {
      fontSize: '24px',
      color: '#ef4444',
    });
    closeBtn.setOrigin(0.5);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.hide());
    closeBtn.on('pointerover', () => closeBtn.setScale(1.2));
    closeBtn.on('pointerout', () => closeBtn.setScale(1));
    this.container.add(closeBtn);

    // Building list
    const buildings = this.registry.getAllBuildings();
    const startY = -menuHeight / 2 + 60;
    const itemHeight = 70;

    buildings.forEach((building, index) => {
      const y = startY + index * itemHeight;
      this.createBuildingItem(building, 0, y, menuWidth - 40);
    });
  }

  /**
   * Create a single building item in the menu
   */
  private createBuildingItem(building: Building, x: number, y: number, width: number): void {
    if (!this.container) return;

    const canAfford = this.resourceEngine.canAfford(building.cost);

    // Item background
    const itemBg = this.scene.add.rectangle(x, y, width, 60, canAfford ? 0x334155 : 0x1e1e1e, 1);
    itemBg.setStrokeStyle(1, canAfford ? 0x475569 : 0x3f3f3f);
    
    if (canAfford) {
      itemBg.setInteractive({ useHandCursor: true });
      itemBg.on('pointerover', () => itemBg.setFillStyle(0x475569));
      itemBg.on('pointerout', () => itemBg.setFillStyle(0x334155));
      itemBg.on('pointerdown', () => this.selectBuilding(building.id));
    }
    
    this.container.add(itemBg);

    // Icon
    const icon = this.scene.add.text(x - width / 2 + 30, y, building.icon, {
      fontSize: '32px',
    });
    icon.setOrigin(0.5);
    this.container.add(icon);

    // Name
    const name = this.scene.add.text(x - width / 2 + 60, y - 15, building.name, {
      fontSize: '16px',
      color: canAfford ? '#ffffff' : '#64748b',
      fontStyle: 'bold',
    });
    this.container.add(name);

    // Cost
    const costText = this.getCostText(building);
    const cost = this.scene.add.text(x - width / 2 + 60, y + 5, costText, {
      fontSize: '12px',
      color: canAfford ? '#94a3b8' : '#ef4444',
    });
    this.container.add(cost);

    // Production
    const prodText = this.getProductionText(building);
    const prod = this.scene.add.text(x + width / 2 - 10, y, prodText, {
      fontSize: '11px',
      color: '#22c55e',
      align: 'right',
    });
    prod.setOrigin(1, 0.5);
    this.container.add(prod);
  }

  /**
   * Get cost display text
   */
  private getCostText(building: Building): string {
    const costs: string[] = [];
    if (building.cost.cpu) costs.push(`${building.cost.cpu} CPU`);
    if (building.cost.storage) costs.push(`${building.cost.storage} Storage`);
    if (building.cost.quality) costs.push(`${building.cost.quality} Quality`);
    if (building.cost.throughput) costs.push(`${building.cost.throughput} Throughput`);
    return costs.length > 0 ? `Cost: ${costs.join(', ')}` : 'Free';
  }

  /**
   * Get production display text
   */
  private getProductionText(building: Building): string {
    const production: string[] = [];
    if (building.production.cpu) production.push(`+${building.production.cpu} CPU/s`);
    if (building.production.storage) production.push(`+${building.production.storage} Storage/s`);
    if (building.production.quality) production.push(`+${building.production.quality} Quality/s`);
    if (building.production.throughput) production.push(`+${building.production.throughput} TP/s`);
    
    const consumption: string[] = [];
    if (building.consumption.cpu) consumption.push(`-${building.consumption.cpu} CPU/s`);
    if (building.consumption.storage) consumption.push(`-${building.consumption.storage} Storage/s`);
    if (building.consumption.quality) consumption.push(`-${building.consumption.quality} Quality/s`);
    if (building.consumption.throughput) consumption.push(`-${building.consumption.throughput} TP/s`);
    
    return [...production, ...consumption].join('\n');
  }

  /**
   * Handle building selection
   */
  private selectBuilding(buildingId: string): void {
    if (this.onBuildingSelected) {
      this.onBuildingSelected(buildingId);
    }
    this.hide();
  }

  /**
   * Check if menu is visible
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }
}
