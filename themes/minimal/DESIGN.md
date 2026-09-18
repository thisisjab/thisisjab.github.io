# Omarchy Design System Specification

A comprehensive design system reference modeled directly from [omarchy.us](https://omarchy.us) ("Beautiful, fun & agentic Linux by DHH").

This document formalizes the visual language, design tokens, typography, component guidelines, and the complete palette of **22 color themes** used in Omarchy.

---

## 1. Design Philosophy

- **Sharp & Architectural**: Zero border-radius (`0px`) by default. Clean, sharp, geometric edges that evoke terminal interfaces and precision engineering.
- **Elevation through Outlines**: Rather than muddy, diffuse drop-shadows, elevation is communicated through crisp 1px borders and translucent outline rings (`0 0 0 1px oklch(...)`).
- **Tactile Feedback**: Subtle micro-interactions, such as a crisp `active:scale-[0.96]` button press, fast 150ms transitions, and high-contrast focus rings.
- **Theme-Centric**: Every color on the canvas—backgrounds, surfaces, borders, text hierarchies, selection states, and brand highlights—is parameterized into semantic tokens that smoothly shift between light and dark palettes.
- **Content-First Simplicity**: Generous spacing, readable line lengths (`--measure: 48rem`), and high text contrast.
- **Text Over Icons**: Favor explicit, readable text and ASCII indicators (e.g., `<<<`, `[rss]`, `[theme]`, `#tags`) over ambiguous iconography. Text avoids visual clutter, eliminates icon-font overhead, aligns cleanly with monospace layout grids, and maintains terminal-grade clarity.
- **Deep Configurability via `hugo.toml`**: The theme is designed to be configurable as much as possible directly through `hugo.toml` without touching theme stylesheets or templates. All key design tokens—typography, font families, base font size, line heights, accent colors, reading measure, header navigation, Table of Contents, and features—map to clean, logically grouped configuration parameters.

---

## 2. Foundational Tokens

### Spacing & Layout
Omarchy uses a base 4px (`0.25rem`) modular scale:

| Token | Value | Pixel Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| `--spacing` | `0.25rem` | `4px` | Base grid unit |
| `--container-xs` | `20rem` | `320px` | Narrow mobile cards / dialogs |
| `--container-sm` | `24rem` | `384px` | Small sidebars / cards |
| `--container-md` | `28rem` | `448px` | Medium modals |
| `--container-xl` | `36rem` | `576px` | Compact reading column |
| `--container-2xl` | `42rem` | `672px` | Standard prose reading width |
| `--container-3xl` | `48rem` | `768px` | Tablet / content container |
| `--container-4xl` | `56rem` | `896px` | Large documentation container |
| `--container-6xl` | `72rem` | `1152px` | Max desktop viewport frame |
| `--measure` | `48rem` | `768px` | Maximum optimal reading line length |

### Corner Radius
Omarchy is deliberately sharp and unrounded:

```css
--radius-sm:  0px;
--radius-md:  0px;
--radius-lg:  0px;
--radius-xl:  0px;
--radius-4xl: 0px;
```

### Elevation & Outlines
Instead of heavy blur shadows, Omarchy utilizes 1px outline rings:

```css
/* Dark Themes */
--t-elevation:       0 0 0 1px oklch(100% 0 0 / 0.07);
--t-elevation-hover: 0 0 0 1px oklch(100% 0 0 / 0.13);

/* Light Themes */
--t-elevation:       0 0 0 1px oklch(0% 0 0 / 0.06), 0 1px 3px oklch(0% 0 0 / 0.05), 0 4px 10px -4px oklch(0% 0 0 / 0.05);
--t-elevation-hover: 0 0 0 1px oklch(0% 0 0 / 0.09), 0 1px 3px oklch(0% 0 0 / 0.07), 0 4px 10px -4px oklch(0% 0 0 / 0.08);
```

### Motion & Timing
Fast, responsive transitions with consistent timing curves:

```css
--default-transition-duration: 0.15s;
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in:  cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Z-Index Layers
```css
--z-nav:      100;
--z-dropdown: 200;
--z-modal:    300;
--z-tooltip:  400;
```

---

## 3. Typography System

### Font Families
- **Headings (Editorial Serif)**: [**IBM Plex Serif**](https://fonts.google.com/specimen/IBM+Plex+Serif) (`"IBM Plex Serif", Georgia, Cambria, "Times New Roman", Times, serif`) — IBM's engineered neo-grotesque companion serif providing crisp technical authority and editorial weight for headings (`h1` through `h6`).
- **Body & Code (Monospace)**: [**Cascadia Code**](https://fonts.google.com/specimen/Cascadia+Code) / [**Caskaydia**](https://github.com/ryanoasis/nerd-fonts) (`"CaskaydiaCove Nerd Font", "Caskaydia", "Cascadia Code", monospace`) — developer monospace font loaded directly from Google Fonts registry with local Nerd Font symbol support.

### Type Scale & Leading

| Class | Font Size | Line Height | Relative Leading | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-xs` | `0.75rem` (12px) | `1.00rem` (16px) | `1.33` | Captions, badges, tags |
| `text-sm` | `0.875rem` (14px) | `1.25rem` (20px) | `1.43` | Secondary metadata, buttons, nav |
| `text-base` | `1.000rem` (16px) | `1.50rem` (24px) | `1.50` | Body copy, paragraphs |
| `text-lg` | `1.125rem` (18px) | `1.75rem` (28px) | `1.55` | Intro paragraphs, subtitles |
| `text-xl` | `1.250rem` (20px) | `1.75rem` (28px) | `1.40` | Section headings (`h4`, `h5`) |
| `text-2xl` | `1.500rem` (24px) | `2.00rem` (32px) | `1.33` | Subsection titles (`h3`) |
| `text-3xl` | `1.875rem` (30px) | `2.25rem` (36px) | `1.20` | Section titles (`h2`) |
| `text-6xl` | `3.750rem` (60px) | `3.75rem` (60px) | `1.00` | Display / Hero titles (`h1`) |

### Tracking (Letter Spacing)
- `--tracking-tight`: `-0.025em` (Headings and large display text)
- `--tracking-normal`: `0` (Body copy)
- `--tracking-wide`: `0.025em` (Uppercase labels, button text)
- `--tracking-widest`: `0.100em` (Monospace labels, metadata codes)

---

## 4. Semantic Color Architecture

Omarchy maps all surface, text, and brand colors to semantic variables:

```css
:root {
    --color-bg-deep:         var(--t-bg-deep);         /* Darkest canvas / backdrop */
    --color-bg:              var(--t-bg);              /* Main page background */
    --color-surface:         var(--t-surface);         /* Cards, sidebars, panel surface */
    --color-surface-2:       var(--t-surface-2);       /* Hover states, active items */
    --color-border-subtle:   var(--t-border-subtle);   /* Dividers, table borders */
    --color-border-strong:   var(--t-border-strong);   /* Focus borders, interactive edges */
    --color-text:            var(--t-text);            /* High-contrast primary text */
    --color-text-secondary:  var(--t-text-secondary);  /* Descriptions, labels, secondary headers */
    --color-text-muted:      var(--t-text-muted);      /* Timestamps, footnotes, muted badges */
    --color-brand:           var(--t-brand);           /* Primary accent / brand color */
    --color-brand-soft:      var(--t-brand-soft);      /* Translucent brand tint (12% alpha) */
    --color-brand-ink:       var(--t-brand-ink);       /* High-contrast text on brand buttons */
    --color-primary:         var(--t-brand);
    --color-primary-foreground: var(--t-brand-ink);
}
```

---

## 5. The 22 Omarchy Color Themes

Below are the 22 authentic theme palettes extracted from Omarchy:

### 🌑 Dark Themes (17 Palettes)

#### 1. Tokyo Night (Default)
```scss
$tokyo-night: (
    bg-deep: #16161e,
    bg: #1a1b26,
    surface: #1f2230,
    surface-2: #24283b,
    border-subtle: #24283b,
    border-strong: #414868,
    text: #c0caf5,
    text-secondary: #a9b1d6,
    text-muted: #565f89,
    brand: #9ece6a,
    brand-ink: #0c0e10,
    selection: #292e42
);
```

#### 2. Catppuccin Mocha
```scss
$catppuccin: (
    bg-deep: #181825,
    bg: #1e1e2e,
    surface: #282839,
    surface-2: #313244,
    border-subtle: #313244,
    border-strong: #585b70,
    text: #cdd6f4,
    text-secondary: #bac2de,
    text-muted: #6c7086,
    brand: #89b4fa,
    brand-ink: #0c0e10,
    selection: #45475a
);
```

#### 3. Gruvbox Dark
```scss
$gruvbox: (
    bg-deep: #1d2021,
    bg: #282828,
    surface: #32302f,
    surface-2: #3c3836,
    border-subtle: #3c3836,
    border-strong: #665c54,
    text: #d4be98,
    text-secondary: #ebdbb2,
    text-muted: #928374,
    brand: #7daea3,
    brand-ink: #0c0e10,
    selection: #504945
);
```

#### 4. Nord
```scss
$nord: (
    bg-deep: #222730,
    bg: #2e3440,
    surface: #343b49,
    surface-2: #3b4252,
    border-subtle: #3b4252,
    border-strong: #4c566a,
    text: #d8dee9,
    text-secondary: #d8dee9,
    text-muted: #9fa7b4,
    brand: #81a1c1,
    brand-ink: #0c0e10,
    selection: #434c5e
);
```

#### 5. Hackerman
```scss
$hackerman: (
    bg-deep: #07080e,
    bg: #0b0c16,
    surface: #10121f,
    surface-2: #151828,
    border-subtle: #151828,
    border-strong: #2d3450,
    text: #ddf7ff,
    text-secondary: #b3ecff,
    text-muted: #5e7099,
    brand: #82fb9c,
    brand-ink: #0c0e10,
    selection: #1f253a
);
```

#### 6. Matte Black
```scss
$matte-black: (
    bg-deep: #0a0a0a,
    bg: #121212,
    surface: #181818,
    surface-2: #1e1e1e,
    border-subtle: #1e1e1e,
    border-strong: #333333,
    text: #eaeaea,
    text-secondary: #b8b8b8,
    text-muted: #707070,
    brand: #e68e0d,
    brand-ink: #0c0e10,
    selection: #2a2a2a
);
```

#### 7. Vantablack
```scss
$vantablack: (
    bg-deep: #090909,
    bg: #000000,
    surface: #0d0d0d,
    surface-2: #1a1a1a,
    border-subtle: #1a1a1a,
    border-strong: #7a7a7a,
    text: #ffffff,
    text-secondary: #cccccc,
    text-muted: #a8a8a8,
    brand: #8d8d8d,
    brand-ink: #0c0e10,
    selection: #1a1a1a
);
```

#### 8. Kanagawa
```scss
$kanagawa: (
    bg-deep: #181820,
    bg: #1f1f28,
    surface: #202838,
    surface-2: #223249,
    border-subtle: #223249,
    border-strong: #54546d,
    text: #dcd7ba,
    text-secondary: #c8c093,
    text-muted: #727169,
    brand: #dcd7ba,
    brand-ink: #0c0e10,
    selection: #363646
);
```

#### 9. Everforest
```scss
$everforest: (
    bg-deep: #232a2e,
    bg: #2d353b,
    surface: #303a40,
    surface-2: #343f44,
    border-subtle: #343f44,
    border-strong: #475258,
    text: #d3c6aa,
    text-secondary: #b8bb26,
    text-muted: #859289,
    brand: #7fbbb3,
    brand-ink: #0c0e10,
    selection: #3d484d
);
```

#### 10. Ethereal
```scss
$ethereal: (
    bg-deep: #030612,
    bg: #060b1e,
    surface: #0c122c,
    surface-2: #131a3a,
    border-subtle: #131a3a,
    border-strong: #6d7db6,
    text: #ffcead,
    text-secondary: #e8b291,
    text-muted: #8490bf,
    brand: #7d82d9,
    brand-ink: #0c0e10,
    selection: #252e56
);
```

#### 11. Last Horizon
```scss
$last-horizon: (
    bg-deep: #090809,
    bg: #0c0b0c,
    surface: #0c0b0c,
    surface-2: #121112,
    border-subtle: #0c0b0c,
    border-strong: #584e51,
    text: #fafcfb,
    text-secondary: #e2dddc,
    text-muted: #a9a5a6,
    brand: #b59790,
    brand-ink: #0c0e10,
    selection: #584e51
);
```

#### 12. Lumon
```scss
$lumon: (
    bg-deep: #101b21,
    bg: #16242d,
    surface: #182836,
    surface-2: #1b2d40,
    border-subtle: #1b2d40,
    border-strong: #304860,
    text: #f2fcff,
    text-secondary: #d6e2ee,
    text-muted: #a0c1d8,
    brand: #8bc9eb,
    brand-ink: #0c0e10,
    selection: #243d56
);
```

#### 13. Miasma
```scss
$miasma: (
    bg-deep: #191919,
    bg: #222222,
    surface: #272727,
    surface-2: #2c2c2c,
    border-subtle: #2c2c2c,
    border-strong: #666666,
    text: #c2c2b0,
    text-secondary: #c2c2b0,
    text-muted: #8c8c82,
    brand: #78824b,
    brand-ink: #0c0e10,
    selection: #383838
);
```

#### 14. Osaka Jade
```scss
$osaka-jade: (
    bg-deep: #0c1512,
    bg: #111c18,
    surface: #1a2a22,
    surface-2: #23372b,
    border-subtle: #23372b,
    border-strong: #53685b,
    text: #f7e8b2,
    text-secondary: #c1c497,
    text-muted: #969978,
    brand: #509475,
    brand-ink: #0c0e10,
    selection: #32473b
);
```

#### 15. Retro 82
```scss
$retro-82: (
    bg-deep: #031222,
    bg: #05182e,
    surface: #081e37,
    surface-2: #0a2540,
    border-subtle: #0a2540,
    border-strong: #2a6b78,
    text: #f6dcac,
    text-secondary: #f6dcac,
    text-muted: #9ab69b,
    brand: #faa968,
    brand-ink: #0c0e10,
    selection: #134e5a
);
```

#### 16. Ristretto
```scss
$ristretto: (
    bg-deep: #211b1b,
    bg: #2c2525,
    surface: #342a28,
    surface-2: #3d2f2a,
    border-subtle: #3d2f2a,
    border-strong: #72696a,
    text: #e6d9db,
    text-secondary: #e6d9db,
    text-muted: #aca1a2,
    brand: #f38d70,
    brand-ink: #0c0e10,
    selection: #403e41
);
```

#### 17. Solitude
```scss
$solitude: (
    bg-deep: #0c0e10,
    bg: #101315,
    surface: #101315,
    surface-2: #181d20,
    border-subtle: #101315,
    border-strong: #4b4e55,
    text: #cacccc,
    text-secondary: #a5aeb4,
    text-muted: #8a8d90,
    brand: #798186,
    brand-ink: #0c0e10,
    selection: #343d41
);
```

---

### ☀️ Light Themes (5 Palettes)

#### 18. White (Clean Light)
```scss
$white: (
    bg-deep: #f5f5f5,
    bg: #ffffff,
    surface: #ffffff,
    surface-2: #f0f0f0,
    border-subtle: #e8e8e8,
    border-strong: #c0c0c0,
    text: #000000,
    text-secondary: #333333,
    text-muted: #777777,
    brand: #6e6e6e,
    brand-ink: #ffffff,
    selection: #c0c0c0
);
```

#### 19. Catppuccin Latte
```scss
$catppuccin-latte: (
    bg-deep: #e6e9ef,
    bg: #eff1f5,
    surface: #f8f9fb,
    surface-2: #dce0e8,
    border-subtle: #d7d8dc,
    border-strong: #acb0be,
    text: #4c4f69,
    text-secondary: #5c5f77,
    text-muted: #8c8fa1,
    brand: #1e66f5,
    brand-ink: #ffffff,
    selection: #ccd0da
);
```

#### 20. Flexoki Light
```scss
$flexoki-light: (
    bg-deep: #f2efe0,
    bg: #fffcf0,
    surface: #f9f6ea,
    surface-2: #e5e2d8,
    border-subtle: #e5e2d8,
    border-strong: #b7b5ac,
    text: #100f0f,
    text-secondary: #282726,
    text-muted: #6f6e69,
    brand: #205ea6,
    brand-ink: #ffffff,
    selection: #cecdc3
);
```

#### 21. Lupine
```scss
$lupine: (
    bg-deep: #ececec,
    bg: #fafafa,
    surface: #ffffff,
    surface-2: #ececec,
    border-subtle: #dedede,
    border-strong: #9e9e9e,
    text: #000000,
    text-secondary: #212121,
    text-muted: #484848,
    brand: #3264eb,
    brand-ink: #ffffff,
    selection: #d0d0d0
);
```

#### 22. Rosé Pine Dawn
```scss
$rose-pine: (
    bg-deep: #f2e9e1,
    bg: #faf4ed,
    surface: #fffaf3,
    surface-2: #f2e9e1,
    border-subtle: #e1dbd5,
    border-strong: #cecacd,
    text: #575279,
    text-secondary: #797593,
    text-muted: #9893a5,
    brand: #56949f,
    brand-ink: #ffffff,
    selection: #dfdad9
);
```

---

## 6. UI Component Patterns

### 0. Text-First Control Conventions
Across all interactive elements, prefer explicit text labels over standalone graphical icons:
- **Navigation & Top Bar**: Use plain text labels (e.g., `[site name]`, `[rss]`, `[theme]`).
- **Action Buttons**: Use descriptive verbs or bracketed words (`[install]`, `[copy]`, `[back]`) instead of icon-only buttons.
- **Back Links**: Use clear ASCII arrows and text (`<<<` or `<<< home`).
- **Metadata Badges**: Use `#` prefixes for tags (`#go`, `#concurrency`) and ISO date strings (`2026-06-14`) without calendar or label icons.

```html
<!-- Good: Explicit text -->
<a href="/index.xml">[rss]</a>
<a href="#" class="theme-toggle">[theme]</a>
```

### 1. Sticky Navigation Bar
```css
.site-header {
    position: sticky;
    top: 0;
    z-index: var(--z-nav);
    background-color: color-mix(in srgb, var(--color-bg) 85%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-border-subtle);
}
```

### 2. Action Buttons
```css
/* Primary Button */
.button-primary {
    background-color: var(--color-brand);
    color: var(--color-brand-ink);
    border: 1px solid transparent;
    border-radius: var(--radius-sm); /* 0px */
    padding: 0.5rem 1rem;
    font-size: var(--text-sm);
    font-weight: 500;
    transition: background-color 0.15s ease-out, transform 0.15s ease-out;
}
.button-primary:hover {
    background-color: color-mix(in srgb, var(--color-brand) 86%, white);
}
.button-primary:active {
    transform: scale(0.96);
}

/* Ghost / Tool Button */
.button-ghost {
    background: transparent;
    color: var(--color-text-secondary);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
}
.button-ghost:hover {
    background-color: var(--color-surface-2);
    color: var(--color-text);
}
.button-ghost:active {
    transform: scale(0.96);
}
```

### 3. Surface Cards & Panels
```css
.card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-sm); /* Sharp 0px */
    padding: 1.5rem;
    transition: border-color 0.15s ease-out;
}
.card:hover {
    border-color: var(--color-border-strong);
}
```

### 4. Code Blocks
```css
pre {
    background-color: var(--color-bg-deep);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-sm);
    padding: 1rem;
    overflow-x: auto;
    font-family: var(--font-mono);
}
```

### 5. Text Selection
```css
::selection {
    background-color: var(--t-selection);
    color: var(--color-text);
}
```

### 6. External Posts & Indicators
Omarchy adheres to **Text Over Icons**. External posts from third-party platforms (Medium, Reddit, Substack) are integrated into standard post listings and decorated with an ASCII indicator badge:
- Badge indicator: `[medium ↗]`, `[reddit ↗]`, or `[ext ↗]` using monospace text and the standard north-east arrow.
- Direct links: In archives, post titles link directly to external destinations with `target="_blank" rel="noopener noreferrer"`.
- Dedicated banner: Direct page views feature a 1px outline banner directing visitors to the original platform.

### 7. Unsplash-Style Flexible Gallery
- Masonry photo grid implemented with native CSS multi-columns (`column-count: 3; column-gap: 1rem;`).
- Zero border-radius (`0px`), crisp 1px borders around every photo frame.
- Bottom gradient caption overlay: reveals smoothly on hover (`opacity: 0` -> `opacity: 1`, `transform: translateY(4px)` -> `translateY(0)`).
- Full compatibility with the modal lightbox zoom overlay.

---

## 7. How to Apply These to the Minimal Theme

To switch `themes/minimal` to any Omarchy palette, open [`themes/minimal/assets/css/colors.scss`](./assets/css/colors.scss) and define your desired dark/light pair using the tokens above:

```scss
// Example: Tokyo Night (Dark) + Flexoki Light (Light)
@mixin dark-appearance {
    @include theme(
        #1a1b26, // bg
        #c0caf5, // primary text
        #9ece6a, // secondary text / headings (brand)
        #9ece6a, // link color
        #9ece6a, // visited color
        #292e42  // highlight / selection
    );
}

@mixin light-appearance {
    @include theme(
        #fffcf0, // bg (flexoki)
        #100f0f, // primary text
        #205ea6, // secondary text (brand)
        #205ea6, // link color
        #205ea6, // visited color
        #cecdc3  // highlight / selection
    );
}
```

---

## 8. Complete `hugo.toml` Configuration Reference

All visual and functional parameters can be configured directly in your site's `hugo.toml`. Below is the complete reference table:

### 1. Core Theme Settings (`[params.theme_config]`)
| Parameter | Type | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `appearance` | string | `"auto"` | Mode: `"auto"` (OS preference), `"dark"`, or `"light"` |
| `back_home_text` | string | `"<<<"` | ASCII back link text on post pages |
| `date_format` | string | `"2006-01-02"` | Date display format across articles and archive |
| `is_list_group_by_date` | bool | `false` | Group posts by year on `/posts/` archive page |
| `toc` | bool | `true` | Globally enable/disable Table of Contents for posts |
| `show_footer` | bool | `true` | Display the status footer across all pages |
| `now_prefix` | string | `"[now]"` | Prefix text before the status statement |
| `footer_now` | string | `"Exploring distributed systems and AI"` | Current status statement displayed in footer |
| `links_title` | string | `"Links"` | Section title for homepage link list |

### 2. Typography (`[params.typography]`)
| Parameter | Type | Default | Target CSS Variable |
| :--- | :--- | :--- | :--- |
| `font_heading` | string | `"IBM Plex Serif", Georgia, serif` | `--font-heading` |
| `font_body` | string | `"CaskaydiaCove Nerd Font", monospace` | `--font-body` |
| `font_code` | string | `"CaskaydiaCove Nerd Font", monospace` | `--font-code` |
| `font_size_base` | string | `"1rem"` (16px) | `--font-size-base` |
| `font_size_code` | string | `"0.875rem"` (14px) | `--font-size-code` |
| `line_height_base` | string | `"1.625"` | `--line-height-base` |
| `line_height_heading` | string | `"1.25"` | `--line-height-heading` |

### 3. Colors & Accents (`[params.colors]`)
| Parameter | Type | Default | Target CSS Variable |
| :--- | :--- | :--- | :--- |
| `accent_color` | string | Palette brand / link color | `--link-color`, `--visited-link-color` |
| `heading_color` | string | Palette secondary / heading | `--heading-color` |
| `subheading_color` | string | Palette subheading | `--subheading-color` |
| `primary_text_color` | string | Palette primary text | `--primary-text-color` |
| `bg_color` | string | Palette background | `--bg-color` |
| `code_bg` | string | Palette code background | `--code-bg` |
| `border_color` | string | Palette outline border | `--border-color` |

### 4. Layout & Measure (`[params.layout]`)
| Parameter | Type | Default | Target CSS Variable |
| :--- | :--- | :--- | :--- |
| `content_width` | string | `"640px"` | `--content-width` |
| `content_padding` | string | `"4rem 2rem"` | `--content-padding` |
| `header_padding` | string | `"0.85rem 2rem"` | `--header-padding` |

### 5. Header Navigation (`[params.navigation]`)
| Parameter | Type | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `show_blog` | bool | `true` | Display `[blog]` link in header |
| `show_gallery` | bool | `false` | Display `[gallery]` link in header |
| `show_rss` | bool | `true` | Display `[rss]` link in header |
| `show_theme_toggle` | bool | `true` | Display `[theme]` toggle button in header |
| `show_tags` | bool | `true` | Display `#tags` on post listing cards |

### 6. Gallery Grid Configuration (`[params.gallery]`)
| Parameter | Type | Default | Target CSS Variable / Purpose |
| :--- | :--- | :--- | :--- |
| `columns` | int | `3` | `--gallery-columns` (Desktop column count) |
| `gap` | string | `"1rem"` | `--gallery-gap` (Grid spacing) |
| `show_caption_hover` | bool | `true` | Display subtle caption overlay on hover |

### 7. Feature Flags (`[params.features]`)
| Parameter | Type | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `lightbox` | bool | `true` | Enable clickable post image zoom overlay |
| `mathjax` | bool | `false` | Enable LaTeX math rendering |

### 8. Ambient Background Characters (`[params.background_characters]`)
| Parameter | Type | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `enable` | bool | `false` | Master toggle (disabled globally, can be enabled per-page or per-post) |
| `density` | int | `24` | Count of characters scattered in outer gutters (`0` disables) |
| `characters` | list[string] | `["*"]` | Character set randomly chosen from (e.g. `["*"]`, `["*", "+", "·"]`) |
| `animation_seconds` | float / int | `0` | Interval in seconds between position updates (`0` disables animation) |
| `animation_count` | int | `1` | Number of characters ($n$) repositioned on each interval tick |
| `color` | string | `""` | Base character color. If empty, uses active theme's non-primary muted color |
| `color_dark` | string | `""` | Optional override specifically for dark theme |
| `color_light` | string | `""` | Optional override specifically for light theme |

#### Enabling in Individual Posts
Any blog post can enable ambient background characters in its markdown frontmatter:

**Method 1: Minimal One-Liner**
```toml
+++
title = "sync.Cond: an Underrated Gem"
date = 2026-06-14T17:08:09+03:30
background_characters = true
+++
```

**Method 2: Custom Per-Post Configuration**
```toml
+++
title = "sync.Cond: an Underrated Gem"
date = 2026-06-14T17:08:09+03:30

[background_characters]
enable            = true
density           = 28
characters        = ["*", "+", "·"]
animation_seconds = 2
animation_count   = 1
color             = "#565f89"
+++
```

#### Performance Architecture & Omarchy Alignment
- **GPU Compositing**: Characters are positioned with `transform: translate3d(x, y, 0)` and tagged with `will-change: transform, opacity;`, offloading rendering to the GPU compositor.
- **Zero Layout Thrashing**: Gutter boundaries and scroll dimensions are measured once on load and updated only during debounced resize. **No `getBoundingClientRect()` calls occur inside animation interval ticks**.
- **Containment**: Container is isolated with `contain: layout paint size;` so background updates never trigger layout reflows on `<main>` or the reading measure.
- **Smart Idling**: Automatically pauses timers via `IntersectionObserver` when scrolled offscreen and via `document.hidden` when the browser tab is inactive. Respects `prefers-reduced-motion: reduce`.



