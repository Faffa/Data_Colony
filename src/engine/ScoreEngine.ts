import { ScoreBreakdown, Resources } from '../types';

/**
 * ScoreEngine - Calculates final game score
 */
export class ScoreEngine {
  /**
   * Calculate final score
   * Formula: (Services × 100) + (Quality × 10) + Throughput
   */
  public static calculateScore(
    servicesProduced: number,
    finalResources: Resources
  ): ScoreBreakdown {
    const servicesScore = servicesProduced * 100;
    const qualityScore = Math.floor(finalResources.quality) * 10;
    const throughputScore = Math.floor(finalResources.throughput);

    const total = servicesScore + qualityScore + throughputScore;

    return {
      services: servicesProduced,
      quality: Math.floor(finalResources.quality),
      throughput: Math.floor(finalResources.throughput),
      total,
    };
  }

  /**
   * Get score rank based on total score
   */
  public static getScoreRank(score: number): string {
    if (score >= 1000) return 'S - Data Master';
    if (score >= 750) return 'A - Senior Engineer';
    if (score >= 500) return 'B - Data Engineer';
    if (score >= 250) return 'C - Junior Developer';
    if (score >= 100) return 'D - Intern';
    return 'F - Needs Training';
  }

  /**
   * Format score for display
   */
  public static formatScore(score: number): string {
    return score.toLocaleString();
  }
}
