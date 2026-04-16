# OneLab Kartoitus - Agent Rules

## Critical Constraints

### DO NOT
- Use Firebase, MongoDB, or any database other than Supabase.
- Add a light theme or theme toggle. Dark theme only.
- Consolidate OneLab Kartoitus with Labbmate or AsbestiPro into a single app. They are separate systems.
- Use OpenAI, LangChain, or any AI service other than Anthropic SDK when AI is needed.
- Replace Resend with SendGrid, Mailgun, or other email services.
- Replace Stripe with any other payment processor.
- Skip Supabase Row-Level Security on any new table.
- Store sensitive data (API keys, credentials) in client-side code.
- Break the three-system architecture boundary.

### ALWAYS
- Use dark theme colors and design patterns consistently across all new UI.
- Apply Row-Level Security (RLS) policies when creating new Supabase tables.
- Handle Stripe webhook verification properly (verify signatures).
- Use TypeScript strict mode with proper type definitions.
- Separate client and lab staff interfaces with role-based access.
- Store uploaded documents and generated PDFs in Supabase Storage with proper bucket policies.
- Handle API errors gracefully with user-facing error messages.
- Use server components by default, client components only when interactivity requires it.

## Code Style
- TypeScript strict mode
- Functional components with React 19 patterns (Server Components, Suspense, transitions)
- Tailwind v4 CSS-first configuration
- Supabase client created via utility functions in `lib/supabase/`
- API routes in `app/api/` with proper error handling and status codes
- Finnish content for customer-facing UI, English for code and internal tooling

## Database Rules
- All tables must have RLS policies before going to production
- Use Supabase migrations for all schema changes (never manual SQL in production)
- Foreign keys and proper indexes on all relations
- Soft deletes preferred over hard deletes for order/sample data

## Integration Rules
- API calls to Labbmate/AsbestiPro must include retry logic
- All external API responses must be validated before processing
- Webhook endpoints must verify request authenticity
- Log all inter-system API calls for debugging

## Testing
- Test Stripe webhook handling with Stripe CLI
- Verify email delivery via Resend after template changes
- Test RLS policies by querying as different user roles
- Validate PDF report output after template changes
