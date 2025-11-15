import Phaser from 'phaser';
import { GridManager } from '../managers/GridManager';
import { ResourceEngine } from '../engine/ResourceEngine';
import { TickEngine } from '../engine/TickEngine';
import gameConfig from '../config/gameConfig.json';

/**
 * Main game scene for Data Colony
 */
export class GameScene extends Phaser.Scene {
  private gridManager!: GridManager;
  private resourceEngine!: ResourceEngine;
  private tickEngine!: TickEngine;
  private hudTexts: Map<string, Phaser.GameObjects.Text>;
  private gameStarted: boolean;

  constructor() {
    super({ key: 'GameScene' });
    this.hudTexts = new Map();
    this.gameStarted = false;
  }

  preload(): void {
    // No assets to preload yet (using emojis and shapes)
  }

  create(): void {
    // Add background
    this.cameras.main.setBackgroundColor('#0f172a');

    // Add title text
    const title = this.add.text(400, 20, 'DATA COLONY', {
      fontSize: '32px',
      color: '#3b82f6',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Initialize game systems
    this.initializeGameSystems();

    // Create HUD
    this.createHUD();

    // Add start message
    const message = this.add.text(400, 150, 'Press SPACE to start', {
      fontSize: '18px',
      color: '#94a3b8',
    });
    message.setOrigin(0.5);

    // Start game on SPACE
    this.input.keyboard?.once('keydown-SPACE', () => {
      message.destroy();
      this.startGame();
    });

    console.log('GameScene created successfully!');
  }

  /**
   * Initialize all game systems
   */
  private initializeGameSystems(): void {
    // Initialize resource engine with starting resources
    this.resourceEngine = new ResourceEngine(gameConfig.startingResources);

    // Initialize grid manager
    this.gridManager = new GridManager(this, gameConfig.gridSize);

    // Initialize tick engine
    this.tickEngine = new TickEngine(this, gameConfig.tickInterval);

    // Register resource update callback
    this.tickEngine.onTickCallback(() => {
      this.resourceEngine.tick();
      this.updateHUD();
    });
  }

  /**
   * Create HUD elements
   */
  private createHUD(): void {
    const hudX = 20;
    const hudY = 50;
    const lineHeight = 25;

    // Resource labels
    const resources = ['CPU', 'Storage', 'Quality', 'Throughput'];
    resources.forEach((resource, index) => {
      const y = hudY + index * lineHeight;

      // Label
      this.add.text(hudX, y, `${resource}:`, {
        fontSize: '16px',
        color: '#94a3b8',
      });

      // Value text
      const valueText = this.add.text(hudX + 100, y, '0 (+0/s)', {
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold',
      });

      this.hudTexts.set(resource.toLowerCase(), valueText);
    });

    // Tick counter (debug)
    const tickText = this.add.text(hudX, hudY + resources.length * lineHeight + 10, 'Ticks: 0', {
      fontSize: '14px',
      color: '#64748b',
    });
    this.hudTexts.set('ticks', tickText);
  }

  /**
   * Update HUD display
   */
  private updateHUD(): void {
    const resources = this.resourceEngine.getResources();
    const rates = this.resourceEngine.getResourceRates();

    // Update each resource display
    const resourceKeys: Array<keyof typeof resources> = ['cpu', 'storage', 'quality', 'throughput'];
    resourceKeys.forEach((key) => {
      const text = this.hudTexts.get(key);
      if (text) {
        const value = Math.floor(resources[key]);
        const rate = rates[`${key}Rate` as keyof typeof rates];
        const rateStr = rate >= 0 ? `+${rate.toFixed(1)}` : rate.toFixed(1);
        text.setText(`${value} (${rateStr}/s)`);
        
        // Color based on rate
        if (rate > 0) {
          text.setColor('#22c55e'); // Green
        } else if (rate < 0) {
          text.setColor('#ef4444'); // Red
        } else {
          text.setColor('#ffffff'); // White
        }
      }
    });

    // Update tick counter
    const tickText = this.hudTexts.get('ticks');
    if (tickText) {
      tickText.setText(`Ticks: ${this.tickEngine.getTickCount()}`);
    }
  }

  /**
   * Start the game
   */
  private startGame(): void {
    this.gameStarted = true;
    this.tickEngine.start();
    this.updateHUD();
    console.log('Game started!');
  }

  update(): void {
    // Game loop (rendering happens here)
  }
}
