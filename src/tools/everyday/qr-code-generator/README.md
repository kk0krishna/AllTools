# QR Code Generator — Developer Documentation

An interactive, high-error-correction QR code generator and PNG downloader built for **ToolVerse**. This tool converts any text string or URL into a scalable vector QR code and provides instant client-side PNG rendering and downloading.

---

## 🏗️ Architecture & Component Overview

This tool is structured into two primary modules within `src/tools/everyday/qr-code-generator/`:

```
qr-code-generator/
├── index.tsx       # UI component, SVG rendering, and Canvas export logic
├── metadata.tsx    # ToolVerse registry entry and SEO metadata
└── README.md       # Developer documentation (this file)
```

---

## ⚙️ Core Generation & Export Logic (`index.tsx`)

### 1. Vector QR Rendering (`qrcode.react`)
* Uses `<QRCodeSVG>` from the `qrcode.react` library to generate vector-based QR codes.
* **Error Correction Level (`level="H"`):** High error correction (up to 30% damage tolerance). This allows logos or icons to be overlaid in the center without breaking scannability.
* **Margin (`includeMargin={true}`):** Adds a standard white quiet zone around the matrix for reliable optical scanning.

### 2. Client-Side PNG Export (`downloadQR`)
To convert the rendered `<svg>` DOM node into a downloadable `.png` bitmap without a backend:
1. **DOM Extraction:** Grabs the SVG node via `document.getElementById("qr-code-svg")`.
2. **XML Serialization:** Serializes the SVG XML string using `new XMLSerializer().serializeToString(svg)`.
3. **Data URI Conversion:** Encodes the XML string into a Base64 URI: `"data:image/svg+xml;base64," + btoa(svgData)`.
4. **Canvas Rasterization:** Creates a virtual `<canvas>`, draws the Base64 image onto the 2D context once loaded (`img.onload`), and exports it using `canvas.toDataURL("image/png")`.
5. **Virtual Anchor Click:** Generates a temporary `<a>` element with `download="qrcode.png"` and programmatically clicks it to trigger the browser download.

---

## 🎨 UI & UX Features

* **Real-Time Reactive Updates:** The SVG re-renders instantly on every keystroke in the `<Input />` field.
* **White Container Backdrop:** Wrapped in a padded white box (`bg-white p-4 rounded-xl`) so the QR code maintains high contrast even when viewed in dark mode.

---

## 🛠️ How to Maintain or Extend This Tool

### Adding Custom Colors (Foreground & Background)
1. Add state variables for hex colors: `const [fgColor, setFgColor] = useState("#000000");` and `const [bgColor, setBgColor] = useState("#ffffff");`
2. Provide two color picker inputs (`<input type="color" />`).
3. Pass these props into the component: `<QRCodeSVG fgColor={fgColor} bgColor={bgColor} ... />`.

### Adding Logo / Icon Embedding
The `qrcode.react` package supports embedding images in the center of Level-H QR codes:
```tsx
<QRCodeSVG
  value={url}
  size={200}
  level="H"
  imageSettings={{
    src: "/logo.png",
    x: undefined,
    y: undefined,
    height: 40,
    width: 40,
    excavate: true, // Clears QR dots behind the logo
  }}
/>
```

### Testing Locally
Run the development server and test URL input and PNG download:
```bash
npm run dev
# Navigate to http://localhost:3000/tools/everyday/qr-code-generator
```
