# OneLab Kartoitus - Architecture

## Stack
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe
- **Email**: Resend
- **Theme**: Dark theme

## Project Structure
```
onelab-kartoitus/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (dark theme)
│   ├── page.tsx            # Landing / ordering page
│   ├── dashboard/          # Internal lab dashboard
│   ├── orders/             # Order management
│   ├── reports/            # PDF report viewing
│   └── api/
│       ├── stripe/         # Stripe webhooks + checkout
│       ├── orders/         # Order CRUD + routing
│       └── reports/        # PDF generation endpoints
├── components/             # Shared components
├── lib/
│   ├── supabase/           # Supabase client + server utils
│   ├── stripe/             # Stripe helpers
│   └── resend/             # Email sending
├── types/                  # TypeScript type definitions
└── supabase/
    └── migrations/         # Database migrations
```

## Key Architecture Decisions
- **Supabase**: Handles auth, database, and file storage (for reports/attachments). Row-Level Security enabled.
- **Stripe**: Handles all payment processing. Webhooks confirm payment and trigger order processing.
- **Resend**: Transactional emails (order confirmations, report delivery).
- **Dark theme**: Enforced globally. No light mode toggle.
- **Three-system architecture**: OneLab Kartoitus communicates with Labbmate and AsbestiPro via REST APIs for order routing and status updates.

## Data Flow
1. Client places order -> Stripe checkout session created
2. Payment confirmed via Stripe webhook -> order saved to Supabase
3. Order routed to appropriate lab/surveyor via API
4. Lab processes sample -> results entered in Labbmate
5. PDF report generated -> stored in Supabase Storage
6. Client notified via Resend email with report link

## Database (Supabase)
- `orders` - Order records with status tracking
- `samples` - Individual samples within orders
- `reports` - Generated PDF reports
- `profiles` - User profiles (clients + lab staff)
- Row-Level Security policies on all tables

## Environment Variables
- Supabase URL + anon key + service role key
- Stripe secret key + webhook signing secret
- Resend API key
- API keys for Labbmate/AsbestiPro integration
