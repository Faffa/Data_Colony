import Phaser from 'phaser';

/**
 * TickEngine - Manages the game tick loop (1 second intervals)
 */
export class TickEngine {
  private scene: Phaser.Scene;
  private tickInterval: number; // in milliseconds
  private tickEvent: Phaser.Time.TimerEvent | null;
  private tickCount: number;
  private isRunning: boolean;
  private tickCallbacks: Array<() => void>;

  constructor(scene: Phaser.Scene, tickInterval: number = 1000) {
    this.scene = scene;
    this.tickInterval = tickInterval;
    this.tickEvent = null;
    this.tickCount = 0;
    this.isRunning = false;
    this.tickCallbacks = [];
  }

  /**
   * Start the tick loop
   */
  public start(): void {
    if (this.isRunning) {
      console.warn('TickEngine already running');
      return;
    }

    this.isRunning = true;
    this.tickCount = 0;

    this.tickEvent = this.scene.time.addEvent({
      delay: this.tickInterval,
      callback: this.onTick.bind(this),
      loop: true,
    });

    console.log('TickEngine started');
  }

  /**
   * Stop the tick loop
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.tickEvent) {
      this.tickEvent.remove();
      this.tickEvent = null;
    }

    console.log('TickEngine stopped');
  }

  /**
   * Pause the tick loop
   */
  public pause(): void {
    if (this.tickEvent) {
      this.tickEvent.paused = true;
    }
    this.isRunning = false;
  }

  /**
   * Resume the tick loop
   */
  public resume(): void {
    if (this.tickEvent) {
      this.tickEvent.paused = false;
    }
    this.isRunning = true;
  }

  /**
   * Register a callback to be called on each tick
   */
  public onTickCallback(callback: () => void): void {
    this.tickCallbacks.push(callback);
  }

  /**
   * Clear all tick callbacks
   */
  public clearCallbacks(): void {
    this.tickCallbacks = [];
  }

  /**
   * Internal tick handler
   */
  private onTick(): void {
    this.tickCount++;

    // Call all registered callbacks
    for (const callback of this.tickCallbacks) {
      try {
        callback();
      } catch (error) {
        console.error('Error in tick callback:', error);
      }
    }
  }

  /**
   * Get current tick count
   */
  public getTickCount(): number {
    return this.tickCount;
  }

  /**
   * Check if engine is running
   */
  public getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Reset tick count
   */
  public reset(): void {
    this.tickCount = 0;
  }
}
