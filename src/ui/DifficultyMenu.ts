import Phaser from 'phaser';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface DifficultyConfig {
  name: string;
  description: string;
  startingResources: {
    cpu: number;
    storage: number;
    quality: number;
    throughput: number;
  };
  costMultiplier: number;
  gameDuration: number;
}

/**
 * DifficultyMenu - UI for selecting game difficulty
 */
export class DifficultyMenu {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container | null = null;
  private selectedDifficulty: Difficulty = 'normal';
  private onSelectCallback?: (difficulty: Difficulty) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Show the difficulty selection menu
   */
  public show(onSelect: (difficulty: Difficulty) => void): void {
    this.onSelectCallback = onSelect;
    
    if (this.container) {
      this.container.destroy();
    }

    // Create semi-transparent background
    const bg = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    bg.setInteractive();

    // Title
    const title = this.scene.add.text(400, 100, 'SELECT DIFFICULTY', {
      fontSize: '32px',
      color: '#3b82f6',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Difficulty options
    const difficulties: { key: Difficulty; color: number; y: number }[] = [
      { key: 'easy', color: 0x22c55e, y: 180 },
      { key: 'normal', color: 0x3b82f6, y: 280 },
      { key: 'hard', color: 0xef4444, y: 380 },
    ];

    const buttons: Phaser.GameObjects.Container[] = [];

    difficulties.forEach(({ key, color, y }) => {
      const config = this.getDifficultyConfig(key);
      
      // Button background
      const btnBg = this.scene.add.rectangle(400, y, 500, 80, color, 0.2);
      btnBg.setStrokeStyle(2, color);
      btnBg.setInteractive({ useHandCursor: true });

      // Button text
      const btnTitle = this.scene.add.text(400, y - 15, config.name.toUpperCase(), {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      btnTitle.setOrigin(0.5);

      // Description text
      const btnDesc = this.scene.add.text(400, y + 10, config.description, {
        fontSize: '14px',
        color: '#94a3b8',
      });
      btnDesc.setOrigin(0.5);

      // Stats text
      const stats = `Start: ${config.startingResources.cpu} CPU, ${config.startingResources.storage} Storage | Time: ${config.gameDuration}s`;
      const btnStats = this.scene.add.text(400, y + 28, stats, {
        fontSize: '12px',
        color: '#64748b',
      });
      btnStats.setOrigin(0.5);

      const button = this.scene.add.container(0, 0, [btnBg, btnTitle, btnDesc, btnStats]);
      buttons.push(button);

      // Hover effects
      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(color, 0.3);
      });

      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(color, 0.2);
      });

      // Click handler
      btnBg.on('pointerdown', () => {
        this.selectDifficulty(key);
      });
    });

    // Container
    this.container = this.scene.add.container(0, 0, [bg, title, ...buttons]);
  }

  /**
   * Select a difficulty and close menu
   */
  private selectDifficulty(difficulty: Difficulty): void {
    this.selectedDifficulty = difficulty;
    
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }

    if (this.onSelectCallback) {
      this.onSelectCallback(difficulty);
    }
  }

  /**
   * Get difficulty configuration
   */
  private getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
    const gameConfig = require('../config/gameConfig.json');
    return gameConfig.difficulties[difficulty];
  }

  /**
   * Hide the menu
   */
  public hide(): void {
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
  }

  /**
   * Get currently selected difficulty
   */
  public getSelectedDifficulty(): Difficulty {
    return this.selectedDifficulty;
  }
}
