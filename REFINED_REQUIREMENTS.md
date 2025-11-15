# 📋 DATA COLONY - REFINED REQUIREMENTS

**Last Updated:** November 15, 2025  
**Status:** Initial Release - Pre-Development  
**Project Type:** Browser-based Strategy Puzzle Game

---

## 🎯 EXECUTIVE SUMMARY

**Data Colony** is a 3-5 minute browser-based strategy puzzle game where players build a data infrastructure on a small grid by placing buildings that generate and consume resources (CPU, Storage, Data Quality, Throughput). The goal is to maximize the end-of-round Service Score through strategic placement and resource management.

**Key Constraints:**
- Solo developer project
- Minimal graphics (colored tiles + icons/emojis)
- Code-driven design focus
- 3-5 minute gameplay sessions

---

## 🎮 CORE GAME REQUIREMENTS

### R1: Game Session Structure
- **R1.1:** Game session duration: 180-300 seconds (3-5 minutes)
- **R1.2:** Grid size: 5×5 (default) or 7×7 (configurable)
- **R1.3:** Turn-based placement with real-time resource ticking (1 tick/second)
- **R1.4:** No "lose" condition - only final score ranking

### R2: Resource System (MUST HAVE)
Four primary resources with production/consumption rates:
- **R2.1:** CPU Cycles (computational power)
- **R2.2:** Storage (data capacity)
- **R2.3:** Data Quality (quality score)
- **R2.4:** Throughput (bandwidth/data flow)

**Resource Behavior:**
- **R2.5:** Resources cannot go negative (buildings stall instead)
- **R2.6:** Resource totals and rates displayed in real-time
- **R2.7:** Resources accumulate per-tick (1 second intervals)

### R3: Building System (MUST HAVE - Launch Set)

**Minimum 6 Building Types:**

1. **CPU Node**
   - Production: +2 CPU/sec
   - Cost: 3 Storage
   - Adjacency: +10% CPU per adjacent CPU Node
   - Icon: ⚙️

2. **Storage Block**
   - Production: +2 Storage/sec
   - Cost: 2 CPU
   - Adjacency: +1 Storage if next to Data Lake
   - Icon: 💾

3. **Data Lake**
   - Production: +1 Storage/sec
   - Cost: 5 CPU
   - Provides adjacency boosts to Storage Blocks
   - Icon: 🌊

4. **ETL Pipeline**
   - Production: +3 Throughput/sec
   - Consumption: -1 CPU/sec, -1 Storage/sec
   - Cost: 2 Storage
   - Adjacency: +20% throughput if next to Data Lake
   - Icon: 🔗

5. **Quality Scanner**
   - Production: +1 Data Quality/sec
   - Cost: 2 CPU
   - Adjacency: +1 quality if next to ETL
   - Icon: 📊

6. **Service Gateway**
   - Production: +1 Service every 3 seconds
   - Consumption: -2 CPU/sec, -1 Throughput/sec
   - Adjacency: +20% output if next to Quality Scanner
   - Icon: 🚀

**Building Rules:**
- **R3.1:** Buildings can only be placed on empty grid cells
- **R3.2:** Building costs deducted immediately upon placement
- **R3.3:** Placement blocked if insufficient resources
- **R3.4:** Buildings are permanent (no removal in v1.0)

### R4: Adjacency System
- **R4.1:** Adjacency checked in 4 directions (N, S, E, W)
- **R4.2:** Adjacency bonuses recalculated every tick
- **R4.3:** Bonuses applied as multipliers to base production rates
- **R4.4:** Visual indicators for active adjacency bonuses (v1.1+)

### R5: Scoring System
- **R5.1:** Final score calculated at timer expiration
- **R5.2:** Score formula: `(Services × 100) + (Quality × 10) + Throughput`
- **R5.3:** Score displayed on end-game screen
- **R5.4:** No persistent leaderboard in v1.0 (future enhancement)

---

## 💻 TECHNICAL REQUIREMENTS

### T1: Platform & Technology
- **T1.1:** Browser-based game (desktop + mobile)
- **T1.2:** Framework: Phaser.js (v3.x)
- **T1.3:** Language: TypeScript/JavaScript
- **T1.4:** No backend required for v1.0
- **T1.5:** Local storage for high scores (optional)

### T2: Performance
- **T2.1:** Initial load time < 3 seconds on modern devices
- **T2.2:** Action latency < 50ms (click to response)
- **T2.3:** No crashes or freezes during 5-minute session
- **T2.4:** 60 FPS target for animations (if any)

### T3: Code Architecture (Modular Design)
Required modules:
- **T3.1:** `BuildingRegistry` - Centralized building definitions
- **T3.2:** `TickEngine` - Game simulation loop (1 Hz)
- **T3.3:** `ResourceEngine` - Resource calculation & tracking
- **T3.4:** `AdjacencyEngine` - Neighbor detection & bonus calculation
- **T3.5:** `ScoreEngine` - End-game score computation
- **T3.6:** `GridManager` - Grid state & cell management

### T4: Extensibility
- **T4.1:** New buildings added via registry only (no core logic changes)
- **T4.2:** Grid size configurable via game settings
- **T4.3:** Tick rate configurable (for testing/difficulty)
- **T4.4:** Building definitions stored in JSON/config files

---

## 🎨 UI/UX REQUIREMENTS

### U1: Visual Design
- **U1.1:** Minimalist design - colored tiles (no complex graphics)
- **U1.2:** Building icons: Unicode emojis (no custom sprites required)
- **U1.3:** Color-coded resource states (positive=green, negative=red)
- **U1.4:** Grid always visible (no scrolling)

### U2: HUD Elements (Always Visible)
- **U2.1:** Resource panel showing current totals + rates
- **U2.2:** Countdown timer (MM:SS format)
- **U2.3:** Grid overlay with cell coordinates (optional)

### U3: Interaction
- **U3.1:** Click/tap empty cell → open building menu
- **U3.2:** Click/tap building → show stats tooltip
- **U3.3:** Building menu shows: name, cost, production, availability
- **U3.4:** Disabled buildings greyed out when unaffordable

### U4: Responsive Design
- **U4.1:** Playable on mobile (portrait or landscape)
- **U4.2:** Touch-optimized controls (minimum 44×44px tap targets)
- **U4.3:** Desktop mouse + keyboard support

---

## 🚀 MVP SCOPE (Version 1.0)

### IN SCOPE
✅ 5×5 grid gameplay  
✅ 6 building types (as defined above)  
✅ 4 resource types  
✅ Adjacency bonus system  
✅ Timer-based rounds (3-5 min)  
✅ End-game score screen  
✅ Single-player only  
✅ Local high score (localStorage)  

### OUT OF SCOPE (Future Versions)
❌ Multiplayer  
❌ Building removal/destruction  
❌ Multiple maps or grid obstacles  
❌ Sound effects / music  
❌ Online leaderboards  
❌ Achievement system  
❌ Building upgrades  
❌ Difficulty modes  

---

## 📊 SUCCESS CRITERIA

### Primary Metrics
1. **Playability:** Game completes without crashes in 95%+ of sessions
2. **Engagement:** Average player attempts 2-3 rounds per session
3. **Replayability:** Player returns to beat high score (measured via localStorage)
4. **Performance:** 60 FPS maintained on mid-range devices

### Secondary Metrics
1. **Development Velocity:** MVP completed within allocated timeline
2. **Code Quality:** New building can be added in < 15 minutes
3. **User Feedback:** Mechanics understood without external tutorial

---

## ⚠️ RISKS & CONSTRAINTS

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Resource balancing too complex | High | Start with 4 resources max, limited building types |
| Adjacency calculation performance issues | Medium | Pre-calculate adjacency grid, cache results |
| UI cluttered on mobile | Medium | Use minimal HUD, single-panel building menu |
| Game too easy/hard | High | Iterative playtesting, adjustable initial resources |
| Scope creep | High | Strict adherence to MVP scope, defer v2 features |

---

## 📝 VALIDATION CHECKLIST

Before marking v1.0 complete, verify:
- [ ] All 6 buildings implemented and balanced
- [ ] All 4 resources working correctly
- [ ] Timer functions properly
- [ ] Score calculation verified
- [ ] Adjacency bonuses apply correctly
- [ ] No negative resource states
- [ ] Game playable on mobile + desktop
- [ ] Load time < 3 seconds
- [ ] No critical bugs in 10+ consecutive playthroughs

---

## 📚 DOCUMENT REFERENCES

- **Source:** `business requirements.md` (BRD + FSD combined)
- **Related:** `PROJECT_TODO.md` (development task breakdown)
- **Related:** `DOCUMENTATION_GUIDELINES.md` (maintenance process)
- **Related:** `TECH_STACK.md` (technology recommendations)

---

**Document Owner:** Development Team  
**Review Frequency:** After each sprint/milestone  
**Next Review Date:** Upon MVP completion
