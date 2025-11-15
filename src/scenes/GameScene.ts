import Phaser from 'phaser';

/**
 * Main game scene for Data Colony
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // No assets to preload yet (using emojis and shapes)
  }

  create(): void {
    // Add background
    this.cameras.main.setBackgroundColor('#0f172a');

    // Add title text
    const title = this.add.text(400, 50, 'DATA COLONY', {
      fontSize: '48px',
      color: '#3b82f6',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Add subtitle
    const subtitle = this.add.text(400, 100, 'Build Your Data Infrastructure', {
      fontSize: '20px',
      color: '#94a3b8',
    });
    subtitle.setOrigin(0.5);

    // Add temporary message
    const message = this.add.text(400, 300, '🚀 Game Setup Complete!\n\nPress SPACE to start building...', {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    });
    message.setOrigin(0.5);

    // Placeholder for game start
    this.input.keyboard?.on('keydown-SPACE', () => {
      message.setText('🎮 Game systems loading...\n\nGrid • Resources • Buildings');
    });

    console.log('GameScene created successfully!');
  }

  update(): void {
    // Game loop will go here
  }
}
