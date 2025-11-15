# 📚 DOCUMENTATION MAINTENANCE GUIDELINES

**Last Updated:** November 15, 2025  
**Owner:** Development Team  
**Purpose:** Ensure all project documentation remains accurate, synchronized, and useful throughout development

---

## 🎯 DOCUMENTATION PHILOSOPHY

### Core Principles
1. **Single Source of Truth:** Each piece of information has ONE authoritative location
2. **Living Documents:** Documentation evolves with the project
3. **Update Before Review:** Documents updated BEFORE code reviews/merges
4. **Simplicity Over Completeness:** Better to have concise, accurate docs than comprehensive but outdated ones

---

## 📄 DOCUMENT HIERARCHY & RELATIONSHIPS

### Master Documents (Source of Truth)
```
business requirements.md  ← Original BRD + FSD (archive/reference)
    ↓
REFINED_REQUIREMENTS.md  ← Authoritative requirements (updated as scope changes)
    ↓
PROJECT_TODO.md          ← Development task breakdown (updated weekly)
    ↓
TECH_STACK.md           ← Technology decisions (updated when tools change)
    ↓
README.md               ← Public-facing documentation (updated at milestones)
```

### Document Relationships
```
REFINED_REQUIREMENTS.md
  ├─ Defines WHAT to build
  ├─ Referenced by: PROJECT_TODO.md, code comments
  └─ Updates trigger: TODO list review, architecture changes

PROJECT_TODO.md
  ├─ Defines HOW and WHEN to build
  ├─ Referenced by: Sprint planning, daily standups
  └─ Updates trigger: Daily (during active development)

TECH_STACK.md
  ├─ Defines WITH WHAT to build
  ├─ Referenced by: Setup docs, README, package.json
  └─ Updates trigger: Technology changes, new dependencies

DOCUMENTATION_GUIDELINES.md (this file)
  ├─ Defines HOW to maintain docs
  ├─ Referenced by: Onboarding, process reviews
  └─ Updates trigger: Process improvements, lessons learned
```

---

## 🔄 UPDATE TRIGGERS & RESPONSIBILITIES

### When to Update Each Document

#### `REFINED_REQUIREMENTS.md`
**Update When:**
- [ ] New feature added to scope
- [ ] Feature removed from scope
- [ ] Core game mechanic changes
- [ ] Success criteria changes
- [ ] MVP scope adjustments

**Update Process:**
1. Identify changed requirement section
2. Update requirement text
3. Update "Last Updated" date at top
4. Update related documents (TODO list)
5. Commit with descriptive message

**Review Frequency:** After each sprint or major milestone

---

#### `PROJECT_TODO.md`
**Update When:**
- [ ] Task completed
- [ ] New task identified
- [ ] Task priority changes
- [ ] Blocker encountered
- [ ] Sprint starts/ends

**Update Process:**
1. Mark completed tasks with `[x]`
2. Add new tasks under appropriate phase
3. Update "Current Sprint Focus"
4. Log decisions in "Notes & Decisions"
5. Update "Last Sprint Review" date

**Review Frequency:** Daily during active development, weekly during planning

---

#### `TECH_STACK.md`
**Update When:**
- [ ] New library/tool added
- [ ] Dependency version upgraded
- [ ] Technology decision changes
- [ ] New hosting platform chosen
- [ ] Build tool configuration changes

**Update Process:**
1. Update relevant technology section
2. Document reason for change in "Decision Log"
3. Update version numbers
4. Update cost estimates if applicable
5. Update related setup instructions

**Review Frequency:** When dependencies change, monthly audit

---

#### `README.md`
**Update When:**
- [ ] MVP launched
- [ ] Major feature added
- [ ] Installation steps change
- [ ] Game rules change
- [ ] Deployment URL changes

**Update Process:**
1. Keep user-facing and concise
2. Update version number
3. Update screenshots/demos if applicable
4. Test all installation steps
5. Update FAQ if needed

**Review Frequency:** Before each public release

---

#### `business requirements.md` (Original BRD/FSD)
**Update When:**
- ⚠️ **ARCHIVE ONLY** - Do not update
- Kept as historical reference
- See `REFINED_REQUIREMENTS.md` for current specs

---

## ✅ DOCUMENT QUALITY CHECKLIST

### Before Committing Documentation Changes
- [ ] "Last Updated" date is current
- [ ] No broken internal references (links to other docs)
- [ ] Formatting is consistent (headings, lists, code blocks)
- [ ] Spelling and grammar checked
- [ ] Technical accuracy verified
- [ ] Examples/code snippets tested (if applicable)
- [ ] Related documents cross-referenced

### Monthly Documentation Audit
- [ ] All documents have been updated in last 60 days OR marked as stable
- [ ] No conflicting information across documents
- [ ] Completed TODO items match actual implementation
- [ ] Tech stack versions match `package.json`
- [ ] Links to external resources still valid

---

## 🔗 CROSS-REFERENCING STANDARDS

### How to Reference Other Documents
Always use relative paths and section anchors where possible:

**Good:**
```markdown
See [Technical Requirements](./REFINED_REQUIREMENTS.md#technical-requirements)
Refer to [Phase 1 Tasks](./PROJECT_TODO.md#phase-1-core-foundation-)
```

**Avoid:**
```markdown
See the requirements document
Check the TODO list for details
```

### Linking to Code
When referencing code from documentation:
```markdown
Implementation: `src/engine/TickEngine.ts`
See building definitions in: `src/config/buildings.json`
```

---

## 📋 DOCUMENT TEMPLATES

### Adding a New Document
When creating a new documentation file, include:

```markdown
# [DOCUMENT TITLE]

**Last Updated:** [Date]
**Status:** [Draft/Active/Archived]
**Owner:** [Team/Person]
**Purpose:** [1-2 sentence description]

---

[Content sections]

---

**Document Owner:** [Name/Team]
**Review Frequency:** [How often to review]
**Related Documents:** [Links to related docs]
```

### Change Log Format (for major docs)
Add to bottom of document if needed:

```markdown
## 📝 CHANGE LOG

### [Date] - [Version]
- **Changed:** [What changed]
- **Reason:** [Why it changed]
- **Impact:** [Who/what is affected]
```

---

## 🚨 HANDLING CONFLICTS & DISCREPANCIES

### When Documents Disagree
1. **Identify the conflict:** Note which documents have conflicting info
2. **Determine source of truth:** Use document hierarchy (see above)
3. **Update dependent documents:** Propagate changes downward
4. **Log the resolution:** Add note to "Notes & Decisions" section
5. **Prevent recurrence:** Consider if process needs improvement

### Escalation Path
```
Minor discrepancy (typo, formatting)
    → Fix immediately

Content conflict (scope, requirements)
    → Review with stakeholder/team
    → Update master document
    → Update dependent documents

Major architectural change
    → Create decision document
    → Update all affected documentation
    → Notify team
    → Archive old versions if needed
```

---

## 🔍 DOCUMENTATION REVIEW PROCESS

### Pre-Development (Phase 0)
- [ ] All foundational docs created
- [ ] Requirements reviewed and finalized
- [ ] Tech stack documented
- [ ] TODO list covers MVP scope

### During Development (Phases 1-6)
- [ ] Daily: Update TODO list task status
- [ ] Weekly: Review TODO priorities and blockers
- [ ] Per Sprint: Update requirements if scope changes
- [ ] Monthly: Audit all docs for accuracy

### Pre-Launch (Phase 7)
- [ ] All MVP requirements marked complete in TODO
- [ ] README finalized for public
- [ ] Architecture documented in code
- [ ] Deployment docs validated

### Post-Launch (Phase 8+)
- [ ] Update docs before implementing new features
- [ ] Maintain changelog for version updates
- [ ] Archive old versions when making breaking changes

---

## 🛠️ TOOLS & AUTOMATION

### Recommended Tools
- **Markdown Linter:** `markdownlint` (VS Code extension)
- **Link Checker:** `markdown-link-check` (validates internal/external links)
- **Spell Check:** VS Code `Code Spell Checker` extension
- **Git Hooks:** Pre-commit hook to check for "Last Updated" date

### Automation Opportunities (Future)
- [ ] Auto-generate TODO checkboxes from code TODO comments
- [ ] Link checker in CI/CD pipeline
- [ ] Auto-update "Last Updated" on file save
- [ ] Generate API documentation from code comments

---

## 📊 DOCUMENTATION METRICS

### Health Indicators (Review Quarterly)
- **Staleness:** % of docs updated in last 60 days
- **Completeness:** % of planned documentation created
- **Accuracy:** # of reported documentation bugs/issues
- **Usage:** # of times docs referenced in code reviews/questions

**Target:**
- 80%+ documents updated in last 60 days
- 100% of MVP docs completed before Phase 7
- 0 known inaccuracies
- Documents reduce repetitive questions

---

## 🎓 ONBOARDING CHECKLIST

### For New Contributors (If Project Grows)
Read in this order:
1. [ ] `README.md` - Understand what the project is
2. [ ] `REFINED_REQUIREMENTS.md` - Understand the requirements
3. [ ] `TECH_STACK.md` - Understand the technology choices
4. [ ] `PROJECT_TODO.md` - Understand current status and priorities
5. [ ] `DOCUMENTATION_GUIDELINES.md` (this file) - Understand how to contribute

---

## 📝 QUICK REFERENCE

### Daily Development Routine
```
1. Pull latest changes
2. Check PROJECT_TODO.md for current tasks
3. Work on task
4. Update TODO with [x] when complete
5. Update code comments/docs if needed
6. Commit with descriptive message
```

### Adding a New Feature
```
1. Add feature to REFINED_REQUIREMENTS.md (if new requirement)
2. Break down into tasks in PROJECT_TODO.md
3. Implement feature
4. Update README.md if user-facing
5. Update TECH_STACK.md if new dependency
6. Mark tasks complete in TODO
```

### Changing Requirements
```
1. Discuss change and get approval
2. Update REFINED_REQUIREMENTS.md first
3. Update PROJECT_TODO.md to reflect new tasks
4. Remove/update obsolete tasks
5. Log decision in "Notes & Decisions"
6. Notify team of change
```

---

## 🔒 DOCUMENT LIFECYCLE

### Document States
- **Draft:** Work in progress, not yet reviewed
- **Active:** Current and maintained
- **Stable:** Complete and rarely changes
- **Archived:** Historical reference only

### Archiving Process
When archiving a document:
1. Add `[ARCHIVED]` prefix to filename
2. Move to `/docs/archive/` folder
3. Add archive date and reason to top of file
4. Update references in other documents
5. Remove from main documentation index

---

## ✨ BEST PRACTICES

### DO
✅ Update docs when you change code  
✅ Keep language clear and concise  
✅ Use examples and code snippets  
✅ Link to related documents  
✅ Date your updates  
✅ Explain WHY, not just WHAT  

### DON'T
❌ Let docs drift from implementation  
❌ Use jargon without explanation  
❌ Create duplicate information  
❌ Commit broken links  
❌ Write documentation for future features not yet scoped  
❌ Over-engineer documentation structure  

---

**Remember:** Documentation is a tool, not a goal. Keep it useful, keep it current, keep it simple.

---

**Last Process Review:** November 15, 2025  
**Next Review:** After MVP completion or 3 months (whichever comes first)
