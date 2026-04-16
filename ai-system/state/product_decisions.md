# OneLab Kartoitus - Product Decisions

## Confirmed Decisions

### Framework & Libraries
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 16 | Latest stable. App Router. |
| UI Library | React 19 | Paired with Next.js 16. Server components, transitions. |
| Styling | Tailwind CSS v4 | Latest. CSS-first config. |
| Database | Supabase | PostgreSQL + Auth + Storage + RLS. Full backend. |
| Payments | Stripe | Industry standard. Webhooks for payment confirmation. |
| Email | Resend | Simple transactional email API. React Email templates. |
| Theme | Dark theme only | Design decision. No light mode toggle. |

### Architecture
| Decision | Choice | Rationale |
|----------|--------|-----------|
| System design | Three-system architecture | OneLab Kartoitus + Labbmate + AsbestiPro. Each system has a clear responsibility. |
| Auth | Supabase Auth | Built-in with RLS integration. Separate roles for clients and lab staff. |
| File storage | Supabase Storage | PDF reports and document uploads stored in Supabase buckets. |
| API communication | REST APIs | Between OneLab, Labbmate, and AsbestiPro. Simple and well-understood. |

## Rejected Alternatives

| Rejected | Why |
|----------|-----|
| Firebase | Supabase chosen for PostgreSQL, open source, and better RLS. |
| Light theme / theme toggle | Dark theme is the design direction. No toggle needed. |
| Consolidating into one app | Three-system architecture keeps each tool focused. Lab management, field work, and ordering are separate concerns. |
| SendGrid / Mailgun | Resend is simpler, modern API, better React Email support. |
| Self-hosted database | Supabase handles hosting, backups, auth. Not worth self-managing. |
