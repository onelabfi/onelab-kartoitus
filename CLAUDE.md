@AGENTS.md

# OneLab Kartoitus — Claude Control File

## Memory Vault
On every new session, read these files for full context:
- ~/Documents/AlexVault/Claude/MEMORY.md
- ~/Documents/AlexVault/Claude/projects/labbmate-asbestipro-onelab.md

## Auto-Memory Rules
- Save new memories to ~/Documents/AlexVault/Claude/
- Update ~/Documents/AlexVault/Claude/MEMORY.md when adding new files

## Project Overview
Asbestos survey/sample ordering platform and internal lab dashboard for OneLab. Connected to Labbmate + AsbestiPro ecosystem.

## Stack
- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind v4
- **Database:** Supabase
- **Payments:** Stripe
- **Email:** Resend
- **Theme:** Dark (Integrale-style)

## Key Features
- Sample ordering and tracking
- PDF report generation
- Stripe payment integration
- API-based order routing (Labbmate ↔ AsbestiPro ↔ OneLab)

---

## Current State (updated 2026-04-16)
- **Stage:** Active MVP with integration work (rebuilt Apr 9, 2026)
- **Current focus:** Integration between Labbmate, AsbestiPro, and OneLab systems
- **What's built:** Dark UI dashboard, order routing API, sample tracking, PDF reports, Stripe payments
- **What's in progress:** Full integration architecture across the 3 systems
- **What's NOT started:** Public-facing customer portal

## Decisions Made — Do NOT Re-Suggest Alternatives
- **Next.js 16 + React 19** — do not suggest older versions or other frameworks
- **Supabase** — do not suggest Firebase or other databases
- **Tailwind v4** — do not suggest v3 or other CSS frameworks
- **Dark theme** (Integrale-style) — do not suggest light theme
- **Stripe** for payments — do not suggest other payment providers
- **Resend** for emails — do not suggest SendGrid or other providers
- **Three-system architecture** (Labbmate + AsbestiPro + OneLab) — do not suggest consolidating into one app

## Rejected Ideas — Stop Suggesting These
- Light theme
- Firebase or non-Supabase database
- Consolidating Labbmate/AsbestiPro/OneLab into a single application
- Non-Stripe payment providers
