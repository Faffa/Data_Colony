import Phaser from 'phaser';
import { GridCell, GridPosition } from '../types';

/**
 * GridManager - Manages the game grid state and rendering
 */
export class GridManager {
  private scene: Phaser.Scene;
  private gridSize: number;
  private cellSize: number;
  private gridOffsetX: number;
  private gridOffsetY: number;
  private grid: GridCell[][];
  private gridGraphics: Phaser.GameObjects.Graphics;
  private cellGraphics: Map<string, Phaser.GameObjects.Rectangle>;
  private onCellClickCallback?: (x: number, y: number) => void;

  constructor(scene: Phaser.Scene, gridSize: number = 5, cellSize: number = 80) {
    this.scene = scene;
    this.gridSize = gridSize;
    this.cellSize = cellSize;
    
    // Calculate grid offset to center it
    const totalGridWidth = gridSize * cellSize;
    const totalGridHeight = gridSize * cellSize;
    this.gridOffsetX = (800 - totalGridWidth) / 2; // 800 is game width
    this.gridOffsetY = (600 - totalGridHeight) / 2 + 30; // 600 is game height, +30 for title
    
    // Initialize grid data structure
    this.grid = [];
    this.cellGraphics = new Map();
    
    // Create graphics object for grid lines
    this.gridGraphics = this.scene.add.graphics();
    
    this.initializeGrid();
    this.renderGrid();
  }

  /**
   * Initialize the grid data structure
   */
  private initializeGrid(): void {
    for (let y = 0; y < this.gridSize; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.gridSize; x++) {
        this.grid[y]![x] = {
          position: { x, y },
          buildingId: null,
        };
      }
    }
  }

  /**
   * Render the grid visually
   */
  private renderGrid(): void {
    // Draw grid cells
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        this.renderCell(x, y);
      }
    }
    
    // Draw grid lines
    this.drawGridLines();
  }

  /**
   * Render a single cell
   */
  private renderCell(x: number, y: number): void {
    const cellX = this.gridOffsetX + x * this.cellSize;
    const cellY = this.gridOffsetY + y * this.cellSize;
    
    // Create cell rectangle
    const cell = this.scene.add.rectangle(
      cellX,
      cellY,
      this.cellSize - 2,
      this.cellSize - 2,
      0x1e293b, // Dark blue-gray
      1
    );
    cell.setOrigin(0);
    cell.setInteractive({ useHandCursor: true });
    
    // Add hover effect
    cell.on('pointerover', () => {
      cell.setFillStyle(0x334155); // Lighter on hover
    });
    
    cell.on('pointerout', () => {
      const gridCell = this.grid[y]![x];
      cell.setFillStyle(gridCell?.buildingId ? 0x0ea5e9 : 0x1e293b);
    });
    
    // Add click handler
    cell.on('pointerdown', () => {
      this.onCellClick(x, y);
    });
    
    // Store reference
    const key = `${x},${y}`;
    this.cellGraphics.set(key, cell);
  }

  /**
   * Draw grid lines
   */
  private drawGridLines(): void {
    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, 0x475569, 0.5); // Subtle gray lines
    
    // Vertical lines
    for (let x = 0; x <= this.gridSize; x++) {
      const lineX = this.gridOffsetX + x * this.cellSize;
      this.gridGraphics.beginPath();
      this.gridGraphics.moveTo(lineX, this.gridOffsetY);
      this.gridGraphics.lineTo(lineX, this.gridOffsetY + this.gridSize * this.cellSize);
      this.gridGraphics.strokePath();
    }
    
    // Horizontal lines
    for (let y = 0; y <= this.gridSize; y++) {
      const lineY = this.gridOffsetY + y * this.cellSize;
      this.gridGraphics.beginPath();
      this.gridGraphics.moveTo(this.gridOffsetX, lineY);
      this.gridGraphics.lineTo(this.gridOffsetX + this.gridSize * this.cellSize, lineY);
      this.gridGraphics.strokePath();
    }
  }

  /**
   * Handle cell click
   */
  private onCellClick(x: number, y: number): void {
    if (this.onCellClickCallback) {
      this.onCellClickCallback(x, y);
      return;
    }

    console.log(`Cell clicked: (${x}, ${y})`);
    const cell = this.grid[y]![x];
    
    if (cell?.buildingId) {
      console.log(`Building at this cell: ${cell.buildingId}`);
    } else {
      console.log('Empty cell - ready for building placement');
    }
    
    // Visual feedback
    const key = `${x},${y}`;
    const cellRect = this.cellGraphics.get(key);
    if (cellRect) {
      cellRect.setFillStyle(0x0ea5e9, 0.5); // Bright blue flash
      this.scene.time.delayedCall(200, () => {
        cellRect.setFillStyle(cell?.buildingId ? 0x0ea5e9 : 0x1e293b);
      });
    }
  }

  /**
   * Set cell click callback
   */
  public setCellClickCallback(callback: (x: number, y: number) => void): void {
    this.onCellClickCallback = callback;
  }

  /**
   * Get cell at position
   */
  public getCell(position: GridPosition): GridCell | null {
    if (this.isValidPosition(position)) {
      return this.grid[position.y]![position.x] ?? null;
    }
    return null;
  }

  /**
   * Set building at position
   */
  public setBuilding(position: GridPosition, buildingId: string | null): boolean {
    if (!this.isValidPosition(position)) {
      return false;
    }
    
    const cell = this.grid[position.y]![position.x];
    if (!cell) {
      return false;
    }

    // If removing a building (buildingId is null), allow it
    // If placing a building, check if cell is empty
    if (buildingId !== null && cell.buildingId !== null) {
      return false; // Cell already occupied
    }
    
    cell.buildingId = buildingId;
    
    // Update visual
    const key = `${position.x},${position.y}`;
    const cellRect = this.cellGraphics.get(key);
    if (cellRect) {
      if (buildingId) {
        cellRect.setFillStyle(0x0ea5e9); // Blue for occupied
      } else {
        cellRect.setFillStyle(0x1e293b); // Dark for empty
      }
    }
    
    return true;
  }

  /**
   * Get neighbors of a cell (N, S, E, W)
   */
  public getNeighbors(position: GridPosition): GridCell[] {
    const neighbors: GridCell[] = [];
    const directions = [
      { x: 0, y: -1 }, // North
      { x: 0, y: 1 },  // South
      { x: 1, y: 0 },  // East
      { x: -1, y: 0 }, // West
    ];
    
    for (const dir of directions) {
      const newPos = { x: position.x + dir.x, y: position.y + dir.y };
      const neighbor = this.getCell(newPos);
      if (neighbor) {
        neighbors.push(neighbor);
      }
    }
    
    return neighbors;
  }

  /**
   * Check if position is valid
   */
  private isValidPosition(position: GridPosition): boolean {
    return (
      position.x >= 0 &&
      position.x < this.gridSize &&
      position.y >= 0 &&
      position.y < this.gridSize
    );
  }

  /**
   * Get all cells
   */
  public getAllCells(): GridCell[][] {
    return this.grid;
  }

  /**
   * Clear grid
   */
  public clear(): void {
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const cell = this.grid[y]![x];
        if (cell) {
          cell.buildingId = null;
        }
        
        const key = `${x},${y}`;
        const cellRect = this.cellGraphics.get(key);
        if (cellRect) {
          cellRect.setFillStyle(0x1e293b);
        }
      }
    }
  }
}
