# Task Manager

A fully functional Task Manager application built using the **Vue 3 Composition API**, **TypeScript**, and **Tailwind CSS**. 

---

## 1. Setup Instructions

The application can be built, validated, and launched with the standard script cycle:

```bash
# 1. Install dependencies
npm install

# 2. Boot the development server on port 3000
npm run dev

# 3. Perform TypeScript / build compilations to dist/
npm run build
```

The server binds to port `3000` on host `0.0.0.0` and serves the app cleanly with zero HMR fumbles.

---

## 2. Architecture Overview

### Component Hierarchy & Data Flow
The architecture is structured according to domain boundaries, completely shielding user-facing UI nodes from editing business mutations:

```
src/
├── App.vue                         # Root Vue layout orchestrator
├── main.ts                         # SPA engine mounting point
├── BLL/                            # BUSINESS LOGIC LAYER
│   └── taskManager/
│       ├── types.ts                # All TypeScript interfaces, type-defs (Single source of truth)
│       ├── mockData.ts             # Explicitly-typed seeds (11+ items, 4+ assignees, 3+ overdue)
│       └── TaskManager.ts          # Core service state-manager (All CRUD & filter logic)
├── components/taskManager/
│   ├── ViewToggle.vue              # Toggle buttons for board vs list views
│   ├── KanbanBoard.vue             # Arranges lanes side-by-side
│   ├── KanbanColumn.vue            # Manages HTML5 Drag/Drop drops inside single lifecycle lanes
│   ├── TaskDetailDrawer.vue        # Shows task details in a drawer from right side
│   ├── TaskCard.vue                # Display individual task card, inline overlays
│   ├── ListView.vue                # Flat collapsible status-grouped table listing
│   └── TaskModal.vue               # Dialog form validating creating and editing tasks
└── pages/taskManager/
    └── index.vue                   # Single page view entry model. Instantiates TaskManager.
```

---

## 3. Design Decisions & UX Choices

**Initials Avatar (No Profile Images)**: User avatars display the assignee's initials instead of a profile photo. The background color is generated deterministically by hashing the assignee's full name, so `Davis Donin` always carries the same color identity across every view — no image assets or API calls required.

**Card-Inline Deletion Overlays**: Instead of blocking `window.confirm` dialogs, cards display a sleek high-contrast overlay on trash selection. This keeps the workspace cohesive and prevents focus disruption.

**Dynamic Overdue Highlighting**: Overdue due dates are rendered in red text to provide immediate visual hierarchy for lingering deliverables.


---

## 4. Known Limitations & Assumptions

**UI Implemented from List View Reference Image**: The test brief included 3 design images, 2 of which had significantly different sidebar layouts and content headers. The sidebar navigation, content header, and tabs were implemented based on the **List View image**, as it provided the most complete and consistent UI reference for the desktop layout.

---

## 5. Time Log

| Goal Phase | Hours Spent | Highlights |
| :--- | :---: | :--- |
| **Phase 1: Setup** | 5.5 hrs | Creating boilerplate and wireframe. data and filters. |
| **Phase 2: Core BLL & Typer System** | 3 hrs | Authoring `types.ts`, seeding high-fidelity mockup data, drafting `TaskManager` class methods, designing persistence triggers. |
| **Phase 3: Drag & Drop Card Deck** | 5.0 hrs | Developing drag events, configuring initials hashing algorithms, color mapping profiles, user avtars, delete popup. |
| **Phase 4: Collapsible List Views** | 6.0 hrs | Constructing list grids, checklists, collaps transitions, toggle managers, and localStorage binds. |
| **Phase 5: Task Modal Form & Error Screening** | 3.0 hrs | form elements, validating date structures, UTC date formmating, showing errors. |
| **Phase 6: High-Fidelity Desktop Workspace Wrap** | 6.0 hrs | Adding sidebar wrappers, letter-spaced column headers, and final polishing, Deatil view with timeline |
| **Total Take-Home Investment** | **28.5 Hours** | |
