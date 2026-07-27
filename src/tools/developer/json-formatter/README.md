# JSON Formatter & Validator — Developer Documentation

An in-browser JSON beautifier, minifier, and syntax validator built for **ToolVerse**. This tool allows developers to paste raw or obfuscated JSON payloads, validate their syntax against JavaScript's native JSON parser, and format or minify them with 1 click.

---

## 🏗️ Architecture & Component Overview

This tool is structured into two primary modules within `src/tools/developer/json-formatter/`:

```
json-formatter/
├── index.tsx       # UI component, textarea state, and parsing logic
├── metadata.tsx    # ToolVerse registry entry and SEO metadata
└── README.md       # Developer documentation (this file)
```

---

## ⚙️ Core Parsing & Validation Logic (`index.tsx`)

### 1. State Management
* **`input`:** Controlled string state bound to an HTML5 `<Textarea>` (monospace styled).
* **`error`:** Stores the syntax error message (`e.message`) if JSON parsing fails.
* **`success`:** Boolean flag that displays a temporary confirmation alert upon successful formatting or minification.

### 2. Beautification (`handleFormat`)
1. Attempts `JSON.parse(input)`.
2. If successful, transforms the JavaScript object back into a string with 2-space indentation using `JSON.stringify(parsed, null, 2)`.
3. Triggers `setSuccess(true)` and sets a 2-second timeout to dismiss the success alert.

### 3. Minification (`handleMinify`)
1. Parses the input using `JSON.parse(input)`.
2. Serializes the object without whitespace or newlines using `JSON.stringify(parsed)`.
3. Useful for preparing JSON payloads for network requests or storage optimization.

---

## 🎨 UI & UX Features

* **Monospace Typography:** Uses `font-mono text-sm` on the textarea to ensure alignment of nested brackets and indentation.
* **Visual Status Alerts:** 
  * Displays a red `<AlertCircle>` block with exact syntax error details when parsing fails.
  * Displays a green `<CheckCircle2>` block when formatting succeeds.

---

## 🛠️ How to Maintain or Extend This Tool

### Adding Custom Indentation Support (2 vs 4 spaces vs Tabs)
1. Add an indentation state variable: `const [indent, setIndent] = useState<number | string>(2);`
2. Provide a dropdown/select element allowing users to choose `2 spaces`, `4 spaces`, or `Tab (\t)`.
3. Pass this state into `JSON.stringify(parsed, null, indent)`.

### Adding "Copy to Clipboard" Functionality
1. Add a button that invokes `navigator.clipboard.writeText(input)`.
2. Display a brief tooltip or button state change (`"Copied!"`) to confirm copy success.

### Testing Locally
Run the development server and test with sample JSON:
```bash
npm run dev
# Navigate to http://localhost:3000/tools/developer/json-formatter
```
