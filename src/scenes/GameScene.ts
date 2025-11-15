import Phaser from 'phaser';
import { GridManager } from '../managers/GridManager';
import { BuildingManager } from '../managers/BuildingManager';
import { BuildingRegistry } from '../managers/BuildingRegistry';
import { ResourceEngine } from '../engine/ResourceEngine';
import { TickEngine } from '../engine/TickEngine';
import { AdjacencyEngine } from '../engine/AdjacencyEngine';
import { ScoreEngine } from '../engine/ScoreEngine';
import { BuildingMenu } from '../ui/BuildingMenu';
import { StorageManager } from '../managers/StorageManager';
import gameConfig from '../config/gameConfig.json';

/**
 * Main game scene for Data Colony
 */
export class GameScene extends Phaser.Scene {
  private gridManager!: GridManager;
  private buildingManager!: BuildingManager;
  private resourceEngine!: ResourceEngine;
  private tickEngine!: TickEngine;
  private adjacencyEngine!: AdjacencyEngine;
  private buildingRegistry!: BuildingRegistry;
  private buildingMenu!: BuildingMenu;
  private hudTexts: Map<string, Phaser.GameObjects.Text>;
  private gameStarted: boolean;
  private gameEnded: boolean;
  private timeRemaining: number;
  private timerText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
    this.hudTexts = new Map();
    this.gameStarted = false;
    this.gameEnded = false;
    this.timeRemaining = gameConfig.gameDuration;
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

    // Add high score display
    const highScore = StorageManager.getHighScore();
    if (highScore > 0) {
      const highScoreText = this.add.text(700, 20, `High Score: ${ScoreEngine.formatScore(highScore)}`, {
        fontSize: '14px',
        color: '#fbbf24',
      });
      highScoreText.setOrigin(0.5);
    }

    // Initialize game systems
    this.initializeGameSystems();

    // Create HUD
    this.createHUD();

    // Create timer display
    this.timerText = this.add.text(700, 50, this.formatTime(this.timeRemaining), {
      fontSize: '24px',
      color: '#22c55e',
      fontStyle: 'bold',
    });
    this.timerText.setOrigin(0.5);

    // Add start message
    const gamesPlayed = StorageManager.getGamesPlayed();
    const startMsg = gamesPlayed > 0 
      ? `🎮 Press SPACE to start\n\nClick cells to place buildings!\nShift+Click to remove (50% refund)\nGames played: ${gamesPlayed}`
      : `🎮 Press SPACE to start\n\nClick cells to place buildings!\nShift+Click to remove (50% refund)\nGoal: Maximize score in 5 minutes`;
    
    const message = this.add.text(400, 150, startMsg, {
      fontSize: '16px',
      color: '#94a3b8',
      align: 'center',
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
    // Initialize building registry
    this.buildingRegistry = BuildingRegistry.getInstance();

    // Initialize resource engine with starting resources
    this.resourceEngine = new ResourceEngine(gameConfig.startingResources);

    // Initialize grid manager
    this.gridManager = new GridManager(this, gameConfig.gridSize);

    // Initialize building manager
    this.buildingManager = new BuildingManager(this, this.gridManager, this.resourceEngine);

    // Initialize adjacency engine
    this.adjacencyEngine = new AdjacencyEngine(this.gridManager, this.buildingManager);

    // Initialize building menu
    this.buildingMenu = new BuildingMenu(this, this.resourceEngine);

    // Set grid click callback to open building menu or remove building
    this.gridManager.setCellClickCallback((x, y) => {
      if (!this.gameStarted || this.gameEnded) return;
      
      const cell = this.gridManager.getCell({ x, y });
      
      // Check if Shift key is pressed for removal
      const shiftKey = this.input.keyboard?.addKey('SHIFT');
      const isShiftPressed = shiftKey?.isDown || false;
      
      if (cell && cell.buildingId && isShiftPressed) {
        // Remove building with Shift+Click
        const success = this.buildingManager.removeBuilding({ x, y });
        if (success) {
          const rates = this.adjacencyEngine.calculateRatesWithAdjacency();
          this.resourceEngine.setResourceRates(rates);
          this.updateHUD();
        }
      } else if (cell && !cell.buildingId) {
        // Place building on empty cell
        this.buildingMenu.show(x, y, (buildingId) => {
          const success = this.buildingManager.placeBuilding(buildingId, { x, y });
          if (success) {
            const rates = this.adjacencyEngine.calculateRatesWithAdjacency();
            this.resourceEngine.setResourceRates(rates);
            this.updateHUD();
          }
        });
      }
    });

    // Initialize tick engine
    this.tickEngine = new TickEngine(this, gameConfig.tickInterval);

    // Register resource update callback
    this.tickEngine.onTickCallback(() => {
      // Calculate rates with adjacency bonuses
      const rates = this.adjacencyEngine.calculateRatesWithAdjacency();
      this.resourceEngine.setResourceRates(rates);
      
      // Update resources
      this.resourceEngine.tick();
      
      // Update timer
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.endGame();
      }
      
      this.updateHUD();
      this.updateTimer();
    });

    // Add keyboard shortcuts for building placement (testing)
    this.setupKeyboardShortcuts();
  }

  /**
   * Setup keyboard shortcuts for quick building placement
   */
  private setupKeyboardShortcuts(): void {
    const buildings = this.buildingRegistry.getAllBuildings();
    const keys = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'];

    buildings.forEach((building, index) => {
      if (index < keys.length) {
        const key = keys[index];
        this.input.keyboard?.on(`keydown-${key}`, () => {
          console.log(`Shortcut ${index + 1}: ${building.name} (${building.icon})`);
          // For testing: place at next available cell
          this.placeNextBuilding(building.id);
        });
      }
    });

    console.log('Keyboard shortcuts: 1-6 to place buildings');
  }

  /**
   * Place building at next available cell (for testing)
   */
  private placeNextBuilding(buildingId: string): void {
    const gridSize = gameConfig.gridSize;
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = this.gridManager.getCell({ x, y });
        if (cell && !cell.buildingId) {
          const success = this.buildingManager.placeBuilding(buildingId, { x, y });
          if (success) {
            // Recalculate rates
            const rates = this.adjacencyEngine.calculateRatesWithAdjacency();
            this.resourceEngine.setResourceRates(rates);
            this.updateHUD();
          }
          return;
        }
      }
    }
    
    console.log('Grid is full!');
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
    this.gameEnded = false;
    this.timeRemaining = gameConfig.gameDuration;
    this.tickEngine.start();
    this.updateHUD();
    this.updateTimer();
    console.log('Game started!');
  }

  /**
   * End the game
   */
  private endGame(): void {
    if (this.gameEnded) return;
    
    this.gameEnded = true;
    this.gameStarted = false;
    this.tickEngine.stop();
    
    // Increment games played
    StorageManager.incrementGamesPlayed();
    
    // Calculate final score
    const score = ScoreEngine.calculateScore(
      this.buildingManager.getServicesProduced(),
      this.resourceEngine.getResources()
    );
    
    // Check for new high score
    const isNewHighScore = StorageManager.setHighScore(score.total);
    
    // Show game over screen
    this.showGameOverScreen(score, isNewHighScore);
    
    console.log('Game ended! Final score:', score.total);
  }

  /**
   * Show game over screen
   */
  private showGameOverScreen(score: any, isNewHighScore: boolean = false): void {
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    overlay.setDepth(2000);

    const container = this.add.container(400, 300);
    container.setDepth(2001);

    // Title
    const titleText = isNewHighScore ? '🎉 NEW HIGH SCORE! 🎉' : 'GAME OVER';
    const titleColor = isNewHighScore ? '#fbbf24' : '#3b82f6';
    const title = this.add.text(0, -180, titleText, {
      fontSize: '48px',
      color: titleColor,
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);
    container.add(title);

    // Score breakdown
    const scoreText = this.add.text(0, -100, 
      `Services: ${score.services} × 100 = ${score.services * 100}\n` +
      `Quality: ${score.quality} × 10 = ${score.quality * 10}\n` +
      `Throughput: ${score.throughput} = ${score.throughput}\n`,
      {
        fontSize: '20px',
        color: '#94a3b8',
        align: 'center',
      }
    );
    scoreText.setOrigin(0.5);
    container.add(scoreText);

    // Total score
    const totalScore = this.add.text(0, 0, `TOTAL SCORE: ${ScoreEngine.formatScore(score.total)}`, {
      fontSize: '32px',
      color: '#22c55e',
      fontStyle: 'bold',
    });
    totalScore.setOrigin(0.5);
    container.add(totalScore);

    // High score display
    const highScore = StorageManager.getHighScore();
    const highScoreText = this.add.text(0, 40, `High Score: ${ScoreEngine.formatScore(highScore)}`, {
      fontSize: '18px',
      color: '#fbbf24',
    });
    highScoreText.setOrigin(0.5);
    container.add(highScoreText);

    // Rank
    const rank = this.add.text(0, 80, ScoreEngine.getScoreRank(score.total), {
      fontSize: '24px',
      color: '#fbbf24',
    });
    rank.setOrigin(0.5);
    container.add(rank);

    // Stats
    const gamesPlayed = StorageManager.getGamesPlayed();
    const stats = this.add.text(0, 115, `Games Played: ${gamesPlayed}`, {
      fontSize: '14px',
      color: '#64748b',
    });
    stats.setOrigin(0.5);
    container.add(stats);

    // Play again button
    const playAgainBtn = this.add.text(0, 160, '🔄 PLAY AGAIN (SPACE)', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#3b82f6',
      padding: { x: 20, y: 10 },
    });
    playAgainBtn.setOrigin(0.5);
    playAgainBtn.setInteractive({ useHandCursor: true });
    playAgainBtn.on('pointerdown', () => this.restartGame());
    playAgainBtn.on('pointerover', () => playAgainBtn.setScale(1.1));
    playAgainBtn.on('pointerout', () => playAgainBtn.setScale(1));
    container.add(playAgainBtn);

    // Keyboard shortcut
    this.input.keyboard?.once('keydown-SPACE', () => this.restartGame());
  }

  /**
   * Restart the game
   */
  private restartGame(): void {
    this.scene.restart();
  }

  /**
   * Update timer display
   */
  private updateTimer(): void {
    this.timerText.setText(this.formatTime(this.timeRemaining));
    
    // Change color based on time remaining
    if (this.timeRemaining <= 30) {
      this.timerText.setColor('#ef4444'); // Red
    } else if (this.timeRemaining <= 60) {
      this.timerText.setColor('#fbbf24'); // Yellow
    } else {
      this.timerText.setColor('#22c55e'); // Green
    }
  }

  /**
   * Format time for display (MM:SS)
   */
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  update(): void {
    // Game loop (rendering happens here)
  }
}
