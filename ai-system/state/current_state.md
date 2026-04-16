# OneLab Kartoitus - Current State

## Status: Active Development

The platform is being built to handle asbestos survey ordering and lab management.

## What Works
- Project scaffolded with Next.js 16, React 19, TypeScript, Tailwind v4
- Supabase connected for auth, database, and storage
- Dark theme implemented globally
- Basic ordering flow structure in place
- Stripe integration for payments
- Resend configured for transactional emails

## What's In Progress
- Sample ordering flow (customer-facing)
- Lab dashboard for order management
- PDF report generation
- API order routing to Labbmate and AsbestiPro

## What's Not Started
- Full three-system API integration testing
- Production Stripe configuration
- Automated report generation pipeline
- Email notification templates
- Customer account management

## Known Issues
- Three-system integration (OneLab <-> Labbmate <-> AsbestiPro) needs API contracts finalized
- PDF report template design not finalized

## Environment
- Development: Local
- Database: Supabase (development project)
- Payments: Stripe test mode
