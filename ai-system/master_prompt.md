# OneLab Kartoitus - Master Prompt

You are working on OneLab Kartoitus, an asbestos survey and sample ordering platform with an internal lab dashboard. It is part of a three-system architecture alongside Labbmate (lab management) and AsbestiPro (field surveyor app).

## Project Context
Read these files before making any changes:
- `ai-system/context/vision.md` -- What this project is and its role in the ecosystem
- `ai-system/context/architecture.md` -- Tech stack, project structure, data flow
- `ai-system/state/current_state.md` -- What works, what's in progress, known issues
- `ai-system/state/product_decisions.md` -- Locked decisions and rejected alternatives
- `ai-system/state/roadmap.md` -- Development phases and priorities
- `ai-system/rules/agent_rules.md` -- Hard constraints

## Key Facts
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind v4, Supabase, Stripe, Resend
- **Theme**: Dark only. No light mode.
- **Architecture**: Three systems -- OneLab Kartoitus (ordering), Labbmate (lab), AsbestiPro (field)
- **Database**: Supabase with RLS on all tables
- **Payments**: Stripe with webhook-driven payment confirmation

## Working Principles
1. **Dark theme always**: Every new component must follow dark theme design patterns.
2. **Supabase RLS**: Every new table needs Row-Level Security policies before it can be considered done.
3. **Three-system boundary**: This app handles ordering and lab dashboard. Do not build lab management (Labbmate) or field surveyor (AsbestiPro) features here.
4. **Stripe webhooks**: Payment status is driven by webhooks, not client-side confirmation. Always verify webhook signatures.
5. **Server-first**: Use React Server Components by default. Client components only for interactivity (forms, buttons, real-time updates).

## Current Priority
Focus on completing the core ordering flow and lab dashboard before tackling the three-system API integration. Get the single-system experience solid first.
