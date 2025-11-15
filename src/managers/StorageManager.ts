/**
 * StorageManager - Manages localStorage for game data
 */
export class StorageManager {
  private static readonly HIGH_SCORE_KEY = 'data-colony-high-score';
  private static readonly GAMES_PLAYED_KEY = 'data-colony-games-played';

  /**
   * Get high score
   */
  public static getHighScore(): number {
    const stored = localStorage.getItem(this.HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }

  /**
   * Set high score (only if it's higher than current)
   */
  public static setHighScore(score: number): boolean {
    const currentHigh = this.getHighScore();
    if (score > currentHigh) {
      localStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
      return true; // New high score!
    }
    return false;
  }

  /**
   * Get games played count
   */
  public static getGamesPlayed(): number {
    const stored = localStorage.getItem(this.GAMES_PLAYED_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }

  /**
   * Increment games played
   */
  public static incrementGamesPlayed(): void {
    const count = this.getGamesPlayed() + 1;
    localStorage.setItem(this.GAMES_PLAYED_KEY, count.toString());
  }

  /**
   * Clear all stored data
   */
  public static clearAll(): void {
    localStorage.removeItem(this.HIGH_SCORE_KEY);
    localStorage.removeItem(this.GAMES_PLAYED_KEY);
  }
}
