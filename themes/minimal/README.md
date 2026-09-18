# Minimal (Hugo Theme)

A clean, hyper-fast, modular Hugo theme built for content, technical writing, and effortless customization. Ported and evolved from `nostyleplease` with a decoupled SCSS architecture, modern typography (Cascadia / Caskaydia), and an extensible design system.

---

## Highlights & Features

- ⚡ **Lightweight & Blazing Fast**: Zero heavy frameworks, under a few kilobytes of compiled CSS.
- 🎨 **Modular SCSS Architecture**: Clean separation into `colors.scss`, `fonts.scss`, `layout.scss`, and `components.scss`.
- 🔤 **Developer-First Typography**: Powered by **Cascadia Code** (and local **Caskaydia / Nerd Font** support) with **Fraunces** editorial serif headings, loaded directly via Google Fonts.
- 🌓 **Theme Modes**: Built-in Dark, Light, and Auto (system preference) modes with an interactive toggle switch.
- 📐 **Sharply Focused Layout**: Distraction-free reading column, clean monospace tables, quotes, and expandable details.
- 📑 **Table of Contents**: Native Goldmark TOC support with toggleable borders.
- 🧮 **MathJax Support**: Optional LaTeX math rendering on demand.
- 📱 **Fully Responsive**: Optimized for phones, tablets, and desktop viewports.

---

## Directory Structure

```text
themes/minimal/
├── assets/
│   ├── css/
│   │   ├── colors.scss       # Color palettes, light/dark themes, selection
│   │   ├── fonts.scss        # Font stacks (Cascadia/Fraunces), sizing, weights
│   │   ├── layout.scss       # Document frame, max-width (.w), dividers
│   │   ├── components.scss   # Code blocks, tables, quotes, details, toggle
│   │   ├── main.scss         # Main manifest importing modules
│   │   └── style.scss        # Alias forwarding to main.scss
│   └── js/
├── layouts/
│   ├── _default/             # Base, single, and list templates
│   ├── partials/             # Head, header, footer, mathjax
│   ├── posts/                # Post layouts
│   └── shortcodes/           # Custom shortcodes
├── static/
├── theme.toml                # Theme metadata
├── DESIGN.md                 # Design system specification (Omarchy-inspired)
└── README.md                 # Documentation
```

---

## Quick Start

### 1. Enable the Theme
In your site's `hugo.toml` (or `config.toml`):

```toml
theme = "minimal"

[params]
  style = "css/main.scss"

  [params.theme_config]
    appearance        = "auto"      # "auto", "dark", or "light"
    back_home_text    = "<<<"       # Text for return link
    date_format       = "2006-01-02"
    isListGroupByDate = false
    isShowFooter      = false
```

### 2. Run Locally
```bash
hugo server -D
```

---

## Customization Guide

### 🎨 Colors (`assets/css/colors.scss`)
All color variables and theme mixins are isolated in `colors.scss`.
- Edit the `@mixin dark-appearance` and `@mixin light-appearance` blocks to customize your palette.
- Switch between included presets (Matrix, Catppuccin, Nightfox/GitHub, Modus) or create your own custom scheme.
- Refer to [`DESIGN.md`](./DESIGN.md) for 22 color palettes modeled from the Omarchy design system.

### 🔤 Typography (`assets/css/fonts.scss`)
- Change `$font-heading` to swap heading styles.
- Change `$font-mono` to modify your monospace coding stack.
- Font imports from Google Fonts registry are managed in `layouts/partials/head.html`.

### 📐 Layout (`assets/css/layout.scss`)
- Adjust the reading container width via `.w` (default: `max-width: 640px`).
- Modify page margins, spacing, and ASCII dividers (`hr`).

### 🧩 Components (`assets/css/components.scss`)
- Customize inline code, syntax highlighted blocks (`pre`, `.highlight`), data tables, blockquotes, and the theme switcher button (`.theme-toggle`).

---

## Front Matter Options

Individual markdown posts can customize layout behavior:

```yaml
---
title: "Sample Post"
date: 2026-09-18
tags: ["go", "concurrency"]
mathjax: true    # Enable LaTeX math rendering
toc: true        # Show Table of Contents
---
```

---

## License

Available as open source under the terms of the [MIT License](LICENSE).
