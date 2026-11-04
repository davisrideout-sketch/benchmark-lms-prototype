# Benchmark LMS prototype

## Goal
A public, clickable LMS prototype for Benchmark International (sell-side M&A advisory) that a senior stakeholder can explore. Demo only, no real login: a "demo sign-in" screen lets the viewer pick a mock Learner, Manager or Admin.

## Rules
- All people and data are fictional.
- Course content is illustrative sample material, not official Benchmark policy.
- Keep it fast and low-cost: no backend, no real auth, no real client data.

## Stack
Vite + React + Tailwind (v4) + Recharts + lucide-react, HashRouter, all data in local JS files (`src/data`), progress saved to localStorage. Deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).

## Design
Inspired by benchmarkintl.com: warm taupe (#A39384), purple (#60529C), charcoal (#2B2B2B); Cinzel headings, Quicksand body. Text wordmark "Benchmark LMS" (no logo file). "Prototype – demo data" badge; noindex meta tag.

## Navigation
Home, For Me, Course Catalogue, Learning Paths, Video Library, Knowledge Base, Practice Arena, Achievements, Reports (managers/admins only), Admin (admins only).

## Phases
1. Foundation: shell, demo sign-in, mock data, Home dashboard (done)
2. Learning: catalogue, course player, quizzes, learning paths, For Me
3. Knowledge Base & Video: searchable articles, video library
4. Practice Arena: scenario/role-play practice exercises
5. Reports & Admin: team/org reports with charts, user and course admin
6. Polish & demo: tour, layout fixes, DEMO.md (done)

## Commands
`npm run dev` (port 3000), `npm run build`.
