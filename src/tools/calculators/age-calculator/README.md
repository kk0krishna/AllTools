# Age Calculator — Developer Documentation

A fast, lightweight date-difference calculator built for **ToolVerse**. This tool allows users to input their date of birth and instantly calculates their exact age in years, months, and days, accounting for leap years and varying month lengths.

---

## 🏗️ Architecture & Component Overview

This tool is structured into two primary modules within `src/tools/calculators/age-calculator/`:

```
age-calculator/
├── index.tsx       # Interactive UI component and calendar math logic
├── metadata.tsx    # ToolVerse registry entry and SEO metadata
└── README.md       # Developer documentation (this file)
```

---

## 🧮 Calendar Math & Date Arithmetic (`index.tsx`)

### 1. State Management
* **`dob` (Date of Birth):** Stored as an ISO date string (`YYYY-MM-DD`) bound to an HTML5 `<input type="date" />`.
* **`age` State:** Holds a structured object `{ years: number, months: number, days: number } | null` representing the computed age difference.

### 2. Date-Difference Logic (`calculateAge`)
When triggered, the calculator computes exact chronological age:
1. **Initial Delta:** Subtracts birth year, month, and date from today's year, month, and date.
2. **Day Borrowing:** If `today.getDate() < birthDate.getDate()` (resulting in negative `days`), it decrements `months` by 1 and borrows days from the preceding month using `new Date(today.getFullYear(), today.getMonth(), 0).getDate()`. This automatically handles varying month lengths (28, 29, 30, or 31 days).
3. **Month Borrowing:** If `months < 0`, it decrements `years` by 1 and adds `12` to `months`.

---

## 🎨 UI Component Design

* **Shadcn Primitives:** Uses `<Card>`, `<Input>`, `<Label>`, and `<Button>` for a clean, consistent design language.
* **Input Validation:** Constrains the `<input type="date" />` via the `max` attribute (`new Date().toISOString().split("T")[0]`) to prevent future birth date selections.
* **Responsive Output Card:** Renders a highlighted summary block displaying large typography for years, followed by months and days.

---

## 🛠️ How to Maintain or Extend This Tool

### Adding Next Birthday Countdown
To display how many days remain until the user's next birthday:
1. Compute next birthday by setting `new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())`.
2. If this date is in the past, increment year by 1: `new Date(today.getFullYear() + 1, ...)`.
3. Subtract `today.getTime()` from the next birthday time and divide by `(1000 * 60 * 60 * 24)` to get remaining days.

### Adding Total Days / Hours Lived Stats
You can expand the output card to show:
* **Total Days Lived:** `Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))`
* **Total Weeks Lived:** Total Days divided by `7`.

### Testing Locally
Run the development server and navigate to the Age Calculator route:
```bash
npm run dev
# Navigate to http://localhost:3000/tools/calculators/age-calculator
```
