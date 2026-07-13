# AllTools

Welcome to **AllTools** – Every Tool. One Place.

AllTools is a scalable, SEO-first platform built for hosting hundreds of practical online utilities, calculators, converters, and developer tools. It is engineered with modern web technologies to be lighting fast, accessible, and completely hostable on Firebase's Free Tier using Static Site Generation (SSG).

![AllTools Promo](./public/promo.png)

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Firebase Hosting (Static Export)

## Features

- **Blazing Fast**: Uses Next.js `output: export` to compile the entire site into pure static HTML, CSS, and JS.
- **Perfect SEO**: Metadata (Title, Description, Keywords, OpenGraph) is generated dynamically at build time for every single tool.
- **Modular Tool Architecture**: Adding a new tool takes only a few minutes and keeps the codebase incredibly organized.
- **Beautiful UI**: Modern, dark-mode ready, premium styling out of the box.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Adding a New Tool

To ensure the codebase scales well to hundreds of tools, we use a modular registry pattern. Follow these steps to add a new tool:

1. **Create the Tool Folder**:
   Create a new folder in `src/tools/<category>/<tool-slug>/`. For example, `src/tools/finance/gst-calculator/`.

2. **Create the Component (`index.tsx`)**:
   Build your interactive React component here using `shadcn/ui` and standard React hooks.

3. **Create the Metadata (`metadata.tsx`)**:
   Define the tool's SEO metadata and documentation content:
   ```tsx
   import { ToolEntry } from "@/tools/registry";
   import { GSTCalculator } from "./index";

   export const gstCalculatorEntry: ToolEntry = {
     metadata: {
       name: "GST Calculator",
       description: "Calculate GST instantly...",
       category: "finance",
       slug: "gst-calculator",
       keywords: ["gst", "tax calculator"],
     },
     component: GSTCalculator,
     content: () => (
       <>
         <h2>How to calculate GST</h2>
         <p>Documentation goes here...</p>
       </>
     ),
   };
   ```

4. **Register the Tool**:
   Open `src/tools/registry.ts` and add your new `ToolEntry` to the `toolsRegistry` array. Next.js will automatically generate the static route, sitemap, and SEO tags on the next build!

## Deployment (Firebase Hosting)

Because this project uses Static Export, it is 100% compatible with the **free tier (Spark Plan)** of Firebase Hosting.

1. Ensure you have the Firebase CLI installed and are logged in:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. Build the static site:
   ```bash
   npm run build
   ```
   *(This compiles everything into the `out/` directory).*

3. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

## License

This project is open-source and free to use.
