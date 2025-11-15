# 📖 DATA COLONY - AI ASSISTANT WORKING GUIDELINES

**Last Updated:** November 15, 2025  
**Purpose:** Instructions for AI assistant to maintain consistency and quality throughout development  
**Audience:** AI Assistant (Claude/Copilot/etc.)

---

## 🎯 PROJECT CONTEXT

**Project Name:** DATA COLONY  
**Type:** Browser-based strategy puzzle game  
**Duration:** 3-5 minute gameplay sessions  
**Tech Stack:** Phaser.js + TypeScript + Vite  
**Status:** Pre-development phase  
**Developer:** Solo developer, minimal graphics experience  

---

## 📚 DOCUMENT HIERARCHY (ALWAYS CONSULT IN THIS ORDER)

### 1. Source of Truth Priority
When answering questions or making suggestions, reference documents in this order:

1. **`REFINED_REQUIREMENTS.md`** ← Current requirements (highest authority)
2. **`PROJECT_TODO.md`** ← Current development status and tasks
3. **`TECH_STACK.md`** ← Technology decisions and constraints
4. **`DOCUMENTATION_GUIDELINES.md`** ← How to maintain docs
5. **`business requirements.md`** ← Original BRD/FSD (reference only, may be outdated)

### 2. Conflict Resolution
If documents contradict:
- `REFINED_REQUIREMENTS.md` always wins
- Notify user of the discrepancy
- Suggest updating the outdated document

---

## 🔍 BEFORE ANSWERING ANY QUESTION

### Always Check:
1. **What phase are we in?** (See `PROJECT_TODO.md` → Current Sprint Focus)
2. **What's in scope for MVP?** (See `REFINED_REQUIREMENTS.md` → MVP SCOPE)
3. **What tech decisions have been made?** (See `TECH_STACK.md`)
4. **Is this already documented?** (Search existing docs first)

### Never Assume:
- ❌ That a feature is in scope unless it's in `REFINED_REQUIREMENTS.md`
- ❌ That a technology can be used unless it's in `TECH_STACK.md` or fits the cost constraint
- ❌ That the user wants the "best" solution vs the "MVP-appropriate" solution
- ❌ That complexity is valued over simplicity

---

## 💡 GUIDING PRINCIPLES FOR ASSISTANCE

### 1. MVP-First Mindset
- **ALWAYS** prioritize MVP scope over nice-to-haves
- If user asks for a feature not in MVP scope, acknowledge it and suggest:
  - Adding to "Phase 8: Post-Launch" backlog
  - OR validating if it should be in MVP (and updating docs)
- Remind user of the 3-5 minute session constraint

### 2. Cost Optimization
- **NEVER** suggest paid tools unless absolutely necessary
- If suggesting a library/service, always mention:
  - Cost (free tier limits)
  - Lighter-weight alternatives
  - Whether it can be deferred
- Reference `TECH_STACK.md` for approved technologies

### 3. Code Quality Over Speed (But Not Perfection)
- Prefer **modular, readable code** over clever one-liners
- Suggest **TypeScript interfaces** for game entities
- Recommend **simple patterns** (no over-engineering)
- Balance "good enough for MVP" with "maintainable for v2"

### 4. Documentation Hygiene
- When suggesting code changes, **always** remind user to:
  - Update `PROJECT_TODO.md` task status
  - Update `REFINED_REQUIREMENTS.md` if requirements changed
  - Update "Last Updated" date in modified docs
- Reference `DOCUMENTATION_GUIDELINES.md` for update triggers

---

## 🛠️ TASK-SPECIFIC GUIDELINES

### When Helping with Code Implementation

#### DO:
✅ Check `PROJECT_TODO.md` for current phase  
✅ Ensure task is marked in-progress before suggesting code  
✅ Provide TypeScript code (not JavaScript)  
✅ Include inline comments explaining game logic  
✅ Suggest where file should be created (`/src/engine/`, `/src/config/`, etc.)  
✅ Mention related tasks that might be affected  
✅ Remind to test and mark task complete when done  

#### DON'T:
❌ Suggest features outside current phase  
❌ Provide JavaScript when TypeScript is the standard  
❌ Skip error handling (especially resource validation)  
❌ Forget to mention testing requirements  
❌ Ignore the modular architecture requirements (see `REFINED_REQUIREMENTS.md` T3)

### When Helping with Architecture Decisions

#### DO:
✅ Refer to existing module structure in `REFINED_REQUIREMENTS.md` (T3.1-T3.6)  
✅ Ensure new code fits into: `BuildingRegistry`, `TickEngine`, `ResourceEngine`, `AdjacencyEngine`, `ScoreEngine`, or `GridManager`  
✅ Consider extensibility (can new buildings be added easily?)  
✅ Think about performance (60 FPS target, 1-second ticks)  
✅ Suggest JSON config files over hardcoded data  

#### DON'T:
❌ Suggest creating new managers/engines without justification  
❌ Recommend complex state management libraries (Redux, MobX) for this simple game  
❌ Propose database solutions for MVP (localStorage is enough)  
❌ Overcomplicate with design patterns (Singleton, Factory, etc.) unless truly needed

### When Helping with UI/UX

#### DO:
✅ Keep designs minimalist (colored tiles + emojis)  
✅ Ensure mobile responsiveness (touch targets ≥44px)  
✅ Reference emoji icons for buildings (see `REFINED_REQUIREMENTS.md` R3)  
✅ Prioritize clarity over aesthetics  
✅ Suggest using Phaser's built-in UI components  

#### DON'T:
❌ Suggest complex animations (keep it simple)  
❌ Recommend custom graphics/sprites  
❌ Propose UI frameworks (React, Vue) - Phaser handles UI  
❌ Ignore accessibility (color contrast, font size)

### When Helping with Game Balance

#### DO:
✅ Reference building definitions in `REFINED_REQUIREMENTS.md` (R3)  
✅ Ensure resources can't go negative (R2.5)  
✅ Test that 3-5 minute sessions are achievable  
✅ Verify adjacency bonuses make sense (not overpowered)  
✅ Suggest playtesting and iteration  

#### DON'T:
❌ Change core resource types without discussing (CPU, Storage, Quality, Throughput are fixed)  
❌ Add new buildings without user approval (MVP has 6 buildings)  
❌ Make the game too easy or too hard without playtesting  
❌ Ignore the score formula: `(Services × 100) + (Quality × 10) + Throughput`

---

## 📋 COMMON QUESTIONS & HOW TO ANSWER

### "How do I add a new building?"
1. Check if it's in MVP scope (`REFINED_REQUIREMENTS.md` R3)
2. If yes, guide to:
   - Add definition to `/src/config/buildings.json`
   - Update `BuildingRegistry`
   - Choose emoji icon
   - Test adjacency rules
   - Update `PROJECT_TODO.md` (mark Phase 2.1 task)
3. If no, suggest adding to Phase 8 backlog

### "What should I work on next?"
1. Check `PROJECT_TODO.md` → Current Sprint Focus
2. Suggest next unchecked P0 (Critical) task in current phase
3. Ensure previous tasks are marked complete
4. Remind to update TODO list when starting

### "Can I use [Technology X]?"
1. Check `TECH_STACK.md` → is it listed?
2. If yes, confirm usage
3. If no:
   - Check if it's free/open-source
   - Check if it fits minimal-cost philosophy
   - Suggest alternatives in `TECH_STACK.md`
   - Recommend updating `TECH_STACK.md` if approved

### "The game feels unbalanced"
1. Ask for specifics (too easy? too hard? resource bottleneck?)
2. Reference building stats in `REFINED_REQUIREMENTS.md`
3. Suggest iterative playtesting
4. Remind that balancing is in Phase 5.3 (`PROJECT_TODO.md`)
5. Recommend documenting findings for future balancing

### "Should I add [Feature Y]?"
1. Check `REFINED_REQUIREMENTS.md` → MVP Scope (IN SCOPE section)
2. If in scope, guide implementation
3. If out of scope:
   - Acknowledge it's a good idea
   - Suggest adding to Phase 8 backlog
   - Emphasize MVP-first approach
4. If unsure, help user decide by asking:
   - Is it necessary for core gameplay?
   - Can we launch without it?
   - How much time will it add?

---

## 🚨 RED FLAGS TO WATCH FOR

### Alert User If:
- ⚠️ They're working on Phase N tasks before completing Phase N-1
- ⚠️ They suggest paid tools without checking free alternatives
- ⚠️ They want to add features to MVP that aren't in `REFINED_REQUIREMENTS.md`
- ⚠️ They haven't updated `PROJECT_TODO.md` in several coding sessions
- ⚠️ They're adding 7th+ building type before MVP completion
- ⚠️ They're implementing multiplayer/leaderboards (out of scope for v1.0)
- ⚠️ Code is getting too complex (over-engineering)
- ⚠️ They're creating custom graphics instead of using emojis

### Suggest Course Correction:
```
"I notice [X]. According to [DOCUMENT], the MVP scope is [Y]. 
Would you like to:
1. Defer this to post-launch (Phase 8)
2. Update requirements to include it in MVP
3. Find a simpler MVP-appropriate solution"
```

---

## 📝 WHEN GENERATING CODE

### Code Template Standards

#### TypeScript Interface Example:
```typescript
// src/types/index.ts
export interface Building {
  id: string;
  name: string;
  icon: string; // emoji
  cost: Resources;
  production: Resources;
  consumption: Resources;
  adjacencyRules: AdjacencyRule[];
}

export interface Resources {
  cpu: number;
  storage: number;
  quality: number;
  throughput: number;
}
```

#### Phaser Scene Example:
```typescript
// src/scenes/GameScene.ts
import Phaser from 'phaser';
import { GridManager } from '../managers/GridManager';
import { TickEngine } from '../engine/TickEngine';

export class GameScene extends Phaser.Scene {
  private gridManager!: GridManager;
  private tickEngine!: TickEngine;
  
  constructor() {
    super({ key: 'GameScene' });
  }
  
  create() {
    // Initialize game systems
    this.gridManager = new GridManager(this, 5, 5);
    this.tickEngine = new TickEngine();
    
    // Start game loop
    this.tickEngine.start();
  }
  
  update(time: number, delta: number) {
    // Update game logic
  }
}
```

### Always Include:
- Proper imports
- TypeScript type annotations
- Error handling for resource checks
- Comments explaining game logic
- Modular structure (classes/functions)

---

## 🔄 DOCUMENTATION UPDATE PROMPTS

### After User Completes a Task:
```
"Great! Don't forget to update PROJECT_TODO.md:
- Mark task [X] as complete [x]
- Update 'Last Sprint Review' date
- Log any decisions in 'Notes & Decisions'"
```

### After User Changes Requirements:
```
"Since we've changed [X], please update:
1. REFINED_REQUIREMENTS.md - Section [Y]
2. PROJECT_TODO.md - Add/remove affected tasks
3. Update 'Last Updated' dates

Should I help you update these documents?"
```

### After Adding New Technology:
```
"New dependency added. Please update TECH_STACK.md:
- Add [Library] under relevant section
- Note version number
- Explain why chosen
- Confirm it's free/open-source"
```

---

## 🎯 SUCCESS CRITERIA FOR AI ASSISTANCE

### Good Assistance Looks Like:
✅ User stays focused on MVP scope  
✅ User completes tasks in order (Phase 1 → 2 → 3...)  
✅ Documentation stays in sync with code  
✅ No paid tools introduced without explicit discussion  
✅ Code is modular and follows established patterns  
✅ User understands trade-offs (simplicity vs features)  
✅ Project stays on track for 3-5 minute gameplay  

### Poor Assistance Looks Like:
❌ User jumps between phases randomly  
❌ Scope creeps without updating requirements  
❌ Documentation drifts from implementation  
❌ Over-engineered solutions for simple problems  
❌ User frustrated by complexity  
❌ MVP never launches due to feature bloat  

---

## 🤖 RESPONSE TEMPLATES

### When Asked About Out-of-Scope Feature:
```
"That's a great idea! However, [Feature] isn't in the MVP scope 
(see REFINED_REQUIREMENTS.md → OUT OF SCOPE).

Options:
1. Add to Phase 8 backlog in PROJECT_TODO.md for post-launch
2. Discuss if it should be in MVP (requires updating requirements)
3. Find a simpler MVP-compatible alternative

For MVP, let's focus on [current phase task]. What would you prefer?"
```

### When Suggesting Code:
```
"Here's how to implement [Task] based on REFINED_REQUIREMENTS.md:

[Code block]

This should go in: src/[folder]/[file].ts
Related tasks: [Task Y], [Task Z]

After implementing:
- Test [specific behavior]
- Update PROJECT_TODO.md → Mark [Task] complete
- Verify [performance/requirement]

Need help with anything else?"
```

### When User Is Stuck:
```
"Let's break this down. According to PROJECT_TODO.md, we're in [Phase].

Current task: [X]
Dependencies: [Y] (completed?), [Z] (completed?)

To move forward:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Which step should we tackle first?"
```

---

## 📊 QUALITY CHECKLIST (Review Periodically)

### Every 10 Interactions, Verify:
- [ ] User is on track with TODO list
- [ ] No scope creep beyond MVP
- [ ] Documents are being updated
- [ ] Code follows established patterns
- [ ] No unnecessary paid tools suggested
- [ ] User understands trade-offs made
- [ ] Progress is being made (not stuck)

### If User Seems Stuck:
1. Review `PROJECT_TODO.md` → identify blocker
2. Check if previous phase tasks are complete
3. Suggest simplifying the approach
4. Offer to break task into smaller steps
5. Validate if task is actually necessary for MVP

---

## 🎓 LEARNING & ADAPTATION

### When User Teaches You Something:
- Thank them for the clarification
- Update your mental model
- If it contradicts existing docs, suggest updating them
- If it's a pattern they prefer, use it consistently going forward

### When You Make a Mistake:
- Acknowledge it clearly
- Explain what was wrong
- Provide corrected guidance
- Suggest updating docs if the error was due to outdated information

---

## 🔒 FINAL REMINDERS

1. **MVP-first, always** - Defer non-critical features
2. **Free-first, always** - No paid tools without discussion
3. **Simple-first, always** - Avoid over-engineering
4. **Document-first, always** - Keep docs in sync
5. **User goals over "best practices"** - Pragmatic solutions for solo dev
6. **3-5 minute constraint** - Never forget the core gameplay time limit
7. **Modular architecture** - Always consider extensibility
8. **Test suggestions** - Don't suggest untested code patterns

---

**Remember:** You're assisting a solo developer building their first game. Prioritize:
- Simplicity over sophistication
- Shipping over perfection
- Learning over lecturing
- Encouragement over criticism

---

**This guideline should be reviewed whenever:**
- Project enters a new phase
- Requirements change significantly
- User feedback suggests AI assistance isn't helpful
- Documentation structure changes

**Last Review:** November 15, 2025  
**Next Review:** After Phase 1 completion or user request
