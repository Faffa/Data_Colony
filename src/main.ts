import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

/**
 * Phaser game configuration
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#0f172a',
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

/**
 * Initialize the Phaser game
 */
const game = new Phaser.Game(config);

console.log('🎮 Data Colony initialized!');

export default game;
