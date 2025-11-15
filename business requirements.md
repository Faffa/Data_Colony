Below is a **complete Business Requirements Document (BRD)** and **Functional Specification (FSD)** for **DATA COLONY** — fully structured and ready to use as a project blueprint.

These are written in a professional product-spec format.

---

# 🟦 **DATA COLONY — BUSINESS REQUIREMENTS DOCUMENT (BRD)**

## 1. **Project Overview**

**Data Colony** is a fast-paced **3–5 minute strategy puzzle game** where the player builds a miniature “data infrastructure colony” on a small grid.
Buildings generate and consume data-related resources such as **CPU Cycles, Storage, Data Quality, and Throughput**.

The goal is to strategically place buildings to maximize end-of-round **Service Score**, balancing CPU, storage, quality, and pipelines within limited time.

The game requires **minimal graphical design**, relying on colored tiles and simple icons.

---

## 2. **Business Goals**

1. **Create a code-driven game** that leverages the developer’s strengths (logical systems, simulations, adjacency bonuses).
2. **Minimize the need for graphic assets**, ensuring the project stays light and achievable.
3. Provide a **fun and replayable** short-session strategy game.
4. Build a foundation that can be expanded:

   * New buildings
   * New maps
   * New challenges
   * Leaderboards
5. Offer a **personal creative project** that:

   * improves system design skills
   * explores resource balancing
   * trains thinking about modular data architectures (fun crossover with your work)

---

## 3. **Target Audience**

* Casual players
* Strategy/puzzle lovers
* People in tech and data roles who appreciate the theme
* Players who prefer short sessions and simple visuals

---

## 4. **Success Metrics**

**Primary:**

* User completes at least **2–3 rounds per session** (short, replayable loop)
* Player performs **multiple attempts** to beat their best score
* Game playable smoothly on mobile and desktop

**Secondary:**

* Easy to add new buildings without redesigning core code
* Sessions remain balanced (win isn’t trivial, loss isn’t frustrating)

---

## 5. **High-Level Requirements**

### 5.1 Gameplay & Mechanics Requirements

1. The game must be playable within **3–5 minutes**.

2. The player must be able to place buildings on a **5×5 or 7×7 grid**.

3. Buildings must:

   * produce, consume, or modify resources
   * interact via adjacency rules

4. The game must include at least these resources:

   * **CPU Cycles**
   * **Storage**
   * **Data Quality**
   * **Throughput (bandwidth)**

5. The game must calculate a **final score** based on:

   * Service Count
   * Data Quality
   * Total Throughput
   * Bonus for efficient layouts

### 5.2 User Interface Requirements

1. The UI must remain minimalist (colored tiles + small icons).
2. Grid must be visible at all times.
3. HUD must display:

   * Resources per second
   * Current totals
   * Timer
   * Build options

### 5.3 Technical Requirements

1. Implemented in **Phaser.js**.
2. Must run in browsers on desktop and mobile.
3. No backend required for first version.
4. Code must be modular:

   * Building registry
   * Resource engine
   * Tick engine
   * Adjacency engine
   * Score engine

### 5.4 Non-Functional Requirements

* Game must load in under **3 seconds** on modern devices.
* No crashes or freezes during 5-minute session.
* Grid interactions must feel responsive (<50ms action latency).

---

## 6. **Constraints**

* No external assets needed — must use simple shapes/colors.
* Audio optional.
* Developer works solo with limited graphics time.
* Scope per session is intentionally small.

---

## 7. **Risks & Mitigations**

| Risk                                | Mitigation                                  |
| ----------------------------------- | ------------------------------------------- |
| Game becomes too complex to balance | Limit early buildings to 6–8 types          |
| UI becomes cluttered                | Keep 1-panel build menu, minimal text       |
| Resource explosion                  | Keep resources capped (natural or soft cap) |
| Player doesn’t understand adjacency | Highlight adjacency bonuses visually        |

---

# ✔ **BUSINESS REQUIREMENTS COMPLETE**

---

# 🟩 **DATA COLONY — FUNCTIONAL SPECIFICATION (FSD)**

This describes exactly **how the game works**, at the mechanical and system level.

---

# 1. **Game Structure**

## 1.1 Game Flow

1. Player selects **Start Round**
2. Grid is generated (5×5 or 7×7)
3. Timer starts (180–300 seconds)
4. Player places buildings
5. Resources update each tick (1 second)
6. Player continues building until time expires
7. Final score screen displayed
8. Player may retry

---

# 2. **Game Entities**

## 2.1 Grid

* Grid size: **configurable** (default 5×5)
* Each cell contains:

  ```ts
  {
    x, y,
    buildingId: null | string,
    adjacency: [],
  }
  ```

## 2.2 Resources

Resources are tracked as:

```ts
{
  cpu: number,
  storage: number,
  quality: number,
  throughput: number
}
```

Plus production/consumption rates:

```ts
{
  cpuRate: number,
  storageRate: number,
  qualityRate: number,
  throughputRate: number
}
```

## 2.3 Buildings

**Mandatory launch buildings:**

### 1. CPU Node

* Produces +2 CPU/sec
* Adjacency: adjacent CPU Nodes +10% CPU each
* Cost: 3 Storage
* Icon: ⚙️

### 2. Storage Block

* Produces +2 Storage/sec
* Adjacency: +1 Storage if next to Data Lake
* Cost: 2 CPU
* Icon: 💾

### 3. Data Lake

* Stores large amounts of data
* +1 Storage/sec
* Gives adjacency boosts to Storage Blocks
* Cost: 5 CPU
* Icon: 🌊

### 4. ETL Pipeline

* Consumes: 1 CPU/sec, 1 Storage/sec
* Produces: +3 Throughput/sec
* Adjacency: +20% if next to Data Lake
* Cost: 2 Storage
* Icon: 🔗

### 5. Quality Scanner

* Produces: +1 Data Quality/sec
* Adjacency: +1 extra if next to ETL
* Cost: 2 CPU
* Icon: 📊

### 6. Service Gateway

* Consumes: 2 CPU/sec, 1 Throughput/sec
* Produces: +1 Service every 3 sec
* Adjacency: +20% output next to Quality Scanner
* Icon: 🚀

---

# 3. **Game Logic**

## 3.1 Tick System

Runs every **1 second**.

For each building:

```
apply consumption
if resources available:
    apply production
else:
    building stalls
```

Stalled buildings produce **0**.

## 3.2 Adjacency Engine

Every tick checks:

```
For each building:
    check neighbors (N,S,E,W)
    apply multipliers based on rules
```

Adjacency multipliers modify production rates.

## 3.3 Resource Engine

* Totals = totals + productionRate - consumptionRate
* Resources can go negative only if allowed (configurable). Default: **no** (stall instead).

---

# 4. **User Interface**

## 4.1 Grid UI

* Square grid with color-coded cells
* Clicking a cell opens building menu
* Tile shows:

  * building icon
  * small live animation (e.g., pulsing)

## 4.2 Resource Panel

Shows:

* CPU: total + rate
* Storage: total + rate
* Quality: total + rate
* Throughput: total + rate
* Timer countdown

## 4.3 Building Menu

* Displays available buildings
* Shows cost
* Disabled if insufficient resources

## 4.4 Score Screen

Displays:

* Total Services produced
* Final Data Quality score
* Final Throughput total
* Combined score:

  ```
  Score = (Services * 100) + (Quality * 10) + Throughput
  ```

---

# 5. **Game Rules**

### 5.1 Building Placement

* Must be placed on empty cells
* Costs must be immediately deducted
* If insufficient resources → action is blocked

### 5.2 Building Removal

(Optional at launch)

* Returns 50% of resources
* Helps fix bad layouts

### 5.3 Win/Lose Conditions

No "lose" state — only:

* time runs out
* player gets final score

### 5.4 Difficulty Scaling

Future addition:

* higher building costs
* limited map seed
* obstacles (blocked tiles)

---

# 6. **Data Structures**

## 6.1 Building Definition Schema

```ts
{
  id: string,
  name: string,
  cost: { cpu, storage },
  production: { cpu, storage, quality, throughput },
  consumption: { cpu, storage },
  adjacencyRules: [
    {
      target: "ETL",
      modifier: { throughput: +0.2 }
    }
  ]
}
```

## 6.2 Game State

```ts
{
  resources,
  buildingsOnGrid,
  timeRemaining,
  score
}
```

---

# 7. **Technical Architecture**

## 7.1 Main Modules

* **GameScene** – Phaser scene with grid rendering
* **BuildMenu** – UI for building selection
* **TickEngine** – handles the simulation loop
* **BuildingRegistry** – centralized list of building definitions
* **AdjacencyEngine** – calculates bonuses
* **ScoreEngine** – computes results at the end

## 7.2 Expandability

Adding a new building requires only:

* adding to registry
* defining costs & rules
* adding icon (emoji OK)

---

# ✔ **FUNCTIONAL SPECIFICATION COMPLETE**
