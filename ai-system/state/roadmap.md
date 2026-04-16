# OneLab Kartoitus - Roadmap

## Phase 1: Core Ordering Flow (Current)
- Complete sample ordering form with service selection
- Stripe checkout integration with webhook handling
- Order confirmation emails via Resend
- Basic order status tracking in Supabase

## Phase 2: Lab Dashboard
- Internal dashboard for lab staff to view and manage orders
- Order status updates (received, processing, completed)
- Sample tracking within orders
- Staff authentication and role-based access

## Phase 3: PDF Reports
- Automated PDF report generation from lab results
- Report storage in Supabase Storage
- Client notification with report download link
- Report template design and branding

## Phase 4: Three-System Integration
- Finalize API contracts between OneLab, Labbmate, and AsbestiPro
- Order routing from OneLab to Labbmate (lab samples)
- Order routing from OneLab to AsbestiPro (field surveys)
- Bidirectional status sync across systems
- Error handling and retry logic for API failures

## Phase 5: Polish & Launch
- Email notification templates (order confirmed, report ready, payment receipt)
- Customer account management (order history, saved info)
- Production Stripe configuration
- Performance optimization and load testing
- Production deployment and DNS setup

## Future Considerations
- Customer portal for viewing past orders and reports
- Bulk ordering for property management companies
- Automated scheduling integration with AsbestiPro
- Analytics dashboard for business metrics
