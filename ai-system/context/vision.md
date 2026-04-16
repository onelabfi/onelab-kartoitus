# OneLab Kartoitus - Vision

## What Is This
An asbestos survey and sample ordering platform with an internal lab dashboard. Part of the Labbmate + AsbestiPro ecosystem. OneLab Kartoitus is the customer-facing ordering interface where clients order asbestos surveys and sample analyses, and lab technicians manage incoming orders.

## Purpose
- Allow clients to order asbestos surveys and sample analyses online
- Process payments via Stripe
- Generate PDF reports for completed analyses
- Route orders to the correct lab/surveyor via API
- Provide an internal dashboard for lab staff to manage orders

## Target Users
- **Clients**: Property managers, renovation companies, homeowners who need asbestos surveys before demolition/renovation work
- **Lab staff**: Technicians who receive and process sample orders through the internal dashboard

## Three-System Architecture
OneLab Kartoitus is one piece of a larger system:
1. **OneLab Kartoitus** (this project) - Customer ordering + lab dashboard
2. **Labbmate** - Lab information management system
3. **AsbestiPro** - Field surveyor mobile app

## Success Metrics
- Orders processed per month
- Payment completion rate
- Order-to-report turnaround time
- API reliability between the three systems
