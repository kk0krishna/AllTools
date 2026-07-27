# ToolVerse Tool Architecture & Development Guide

This directory (`src/tools/`) contains the modular registry and self-contained implementation packages for every online tool in **ToolVerse**.

---

## 📁 Standard Tool Directory Structure

Every tool in ToolVerse **MUST** be placed under a category subfolder (`src/tools/[category]/[slug]/`) and strictly follow this 3-file minimum architecture:

```
src/tools/
├── [category]/
│   └── [tool-slug]/
│       ├── index.tsx       # Main interactive UI component (client-side React)
│       ├── metadata.tsx    # ToolEntry metadata, SEO keywords, and user FAQ articles
│       └── README.md       # Developer documentation (architecture, state, maintenance)
└── registry.ts             # Central registry array exposing all tools to dynamic routes
```

### 1. `index.tsx` (Interactive UI & Logic)
* Must use `'use client';` at the top if using React hooks (`useState`, `useEffect`, etc.).
* Built using Shadcn UI primitives (`Card`, `Button`, `Input`, `Label`, etc.).
* All heavy computations (DSP, JSON parsing, date math) should execute client-side for privacy and speed.

### 2. `metadata.tsx` (SEO, FAQs & User Guides)
* Exports a `ToolEntry` object containing:
  * **`metadata`:** Name, description, category, slug, and SEO keywords.
  * **`component`:** The main interactive component from `index.tsx`.
  * **`content`:** (Optional but recommended) A rich JSX documentation component rendering detailed user instructions, usage guides, and interactive FAQ accordions (`<details>`).

### 3. `README.md` (Developer Documentation)
* Every tool **MUST** include a separate developer README explaining:
  * **Architecture & Overview:** What the tool does and file layout.
  * **Core Logic & Algorithms:** In-depth explanation of math, DSP, parsing, or state management.
  * **UI & UX Details:** Notable visual components or responsive features.
  * **Maintenance & Extension Ideas:** Actionable steps for future developers to add features or tweak configurations.

---

## ➕ How to Register a New Tool

Once you have created your tool folder with `index.tsx`, `metadata.tsx`, and `README.md`:

1. Open `src/tools/registry.ts`.
2. Import your tool entry:
   ```ts
   import { myNewToolEntry } from "./[category]/[tool-slug]/metadata";
   ```
3. Add it to the `toolsRegistry` array:
   ```ts
   export const toolsRegistry: ToolEntry[] = [
     ...
     myNewToolEntry,
   ];
   ```
4. Run lint and build checks:
   ```bash
   npm run lint
   npm run build
   ```
