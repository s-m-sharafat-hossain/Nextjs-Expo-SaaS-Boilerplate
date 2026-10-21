# Design Configuration Guide

## 🎨 Central Design System

All design tokens (colors, typography, spacing, border radii, shadows) are controlled from a single file:

### **Edit This File to Change Everything:**
`packages/shared/config/master.config.ts` → `masterConfig.design`

> This is the **Single Source of Truth** shared across `apps/web` and `apps/mobile`.

## 📁 Design File Structure

```
packages/
└── shared/
    └── config/
        └── master.config.ts       # MAIN DESIGN & BRAND CONFIGURATION (web + mobile)

apps/web/src/
├── shared/
│   ├── config/
│   │   ├── env.ts                # Environment variable validation
│   │   ├── openapi.ts            # OpenAPI/Swagger specification
│   │   └── i18n.ts               # Multi-language support
│   ├── styles/
│   │   └── design-variables.css  # CSS variables (synced from master.config.ts)
│   ├── design/
│   │   ├── colors.ts             # Color utilities
│   │   ├── typography.ts         # Typography utilities
│   │   ├── spacing.ts            # Spacing utilities
│   │   ├── theme-provider.tsx    # Dark/light mode provider
│   │   └── ui/                   # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── badge.tsx
│   └── components/
│       ├── Sidebar.tsx           # Navigation sidebar
│       └── ThemeToggle.tsx       # Dark/light mode toggle
```

## 🎯 How to Change Colors

### Step 1: Edit `packages/shared/config/master.config.ts`

```typescript
export const masterConfig = {
  design: {
    colors: {
      primary: {
        light: "#3b82f6",    // Change to your brand color
        dark: "#60a5fa",
        hover: "#2563eb",
      },
      secondary: {
        light: "#8b5cf6",    // Change secondary accent
        dark: "#a78bfa",
      },
      // ... more colors
    },
  },
  // ... other config
};
```

### Step 2: The changes automatically apply to:
- ✅ All buttons
- ✅ All cards
- ✅ All inputs
- ✅ All badges
- ✅ All backgrounds
- ✅ All text
- ✅ All borders
- ✅ Sidebar
- ✅ Navigation
- ✅ Headers
- ✅ All pages

## 🎨 Available Color Settings

| Setting | What It Controls |
|---------|------------------|
| `primary.light` | Main brand color (light mode) |
| `primary.dark` | Main brand color (dark mode) |
| `primary.hover` | Hover state for primary color |
| `secondary.light` | Secondary accent color |
| `background.primary` | Main background color |
| `background.secondary` | Secondary background (sections) |
| `text.primary` | Main text color |
| `text.secondary` | Secondary text (labels, descriptions) |
| `border` | Border color for cards, inputs |
| `card` | Card background color |
| `success` | Success badges/messages |
| `warning` | Warning badges/messages |
| `error` | Error badges/messages |

## 🔤 Typography Settings

```typescript
typography: {
  fontFamily: {
    primary: '"Inter", ...',  // Main font
    mono: '"JetBrains Mono", ...', // Code font
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    // ... more sizes
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
}
```

## 📐 Spacing Settings

```typescript
spacing: {
  xs: "0.5rem",   // 8px
  sm: "1rem",     // 16px
  md: "1.5rem",   // 24px
  lg: "2rem",     // 32px
  xl: "3rem",     // 48px
  "2xl": "4rem",  // 64px
}
```

## 🎯 Border Radius Settings

```typescript
borderRadius: {
  sm: "0.375rem",  // 6px
  md: "0.5rem",    // 8px
  lg: "0.75rem",   // 12px
  xl: "1rem",      // 16px
  full: "9999px",  // Fully rounded
}
```

## 🌙 Dark Mode

Dark mode is automatically supported. The theme toggle button allows users to switch between light and dark modes. All colors have both light and dark variants in the config.

## 📱 Common Page Structure

All pages follow this structure:

```
Page Component
├── Header/Navigation
├── Hero Section (optional)
├── Main Content
│   ├── Cards
│   ├── Grid Layouts
│   └── Interactive Elements
└── Footer (optional)
```

## 🧩 Reusable Components

### Button
```tsx
import { Button } from "@/shared/design/ui";

<Button variant="default" size="lg">Click me</Button>
<Button variant="outline" size="sm">Secondary</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/design/ui";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Input
```tsx
import { Input } from "@/shared/design/ui";

<Input placeholder="Enter text..." />
```

### Badge
```tsx
import { Badge } from "@/shared/design/ui";

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

## 🚀 Quick Start

1. **Change primary color:**
   Edit `packages/shared/config/master.config.ts` → `masterConfig.design.colors.primary.light`

2. **Change font:**
   Edit `packages/shared/config/master.config.ts` → `masterConfig.design.typography.fontFamily.primary`

3. **Change spacing:**
   Edit `packages/shared/config/master.config.ts` → `masterConfig.design.spacing`

4. **Save and refresh** - Changes apply instantly!

## 📦 Branding vs Design

- **`packages/shared/config/master.config.ts`** → `masterConfig.brand` — Business branding (app name, currency, plans, payment gateways, role labels)
- **`packages/shared/config/master.config.ts`** → `masterConfig.design` — Visual design (colors, fonts, spacing, borders)
- **`apps/web/src/shared/config/`** — Web-specific config (env vars, OpenAPI spec, i18n)

All three work together to give you complete control over your application's appearance and functionality.
