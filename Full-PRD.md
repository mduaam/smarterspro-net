Here is the complete PRD in a single Markdown file. You can copy and save it as `PRD.md`:

```markdown
# FINAL PRODUCT REQUIREMENTS DOCUMENT (PRD) – REVISED

## IPTV Smarters Pro Official Clone – Full‑Stack E‑commerce & CRM Platform with Manual Payment Instructions

> **Target Website:** [https://iptvsmartersprofficiel.com/](https://iptvsmartersprofficiel.com/)  
> **Objective:** Build a fully functional, scalable clone with advanced admin dashboard (analytics, CRM, live chat, subscription management, content management) using modern Jamstack architecture.  
> **Payment Flow:** No online payment gateway. Customers receive payment instructions (bank transfer, WhatsApp, etc.) via email. Admin manually verifies and activates subscriptions.  
> **Version:** 2.0 (Manual Payment)  
> **Date:** 2026‑05‑31

---

## 1. Executive Summary

This document defines the complete requirements for building a production‑ready clone of the IPTV Smarters Pro official website. The system will support:

- Subscription‑based e‑commerce **without integrated online payments**
- Manual payment instructions sent via **email or WhatsApp**
- Admin dashboard to manage payment confirmations and activate subscriptions
- Advanced admin dashboard with real‑time analytics, CRM, live chat, content management, and role‑based access
- Headless CMS (Sanity.io) for blog and marketing content
- Email automation (Resend)
- Live chat (Supabase Realtime)
- Hosting on Netlify with CI/CD from GitHub

**Tech Stack:** Next.js 14 (App Router, TypeScript, Tailwind CSS), Supabase (Auth + PostgreSQL), Sanity.io, Resend, Netlify, GitHub.  
**No Stripe or other payment gateways.**

---

## 2. System Architecture & Workflow

### 2.1 High‑Level Architecture Diagram

```
[User] → Next.js Frontend
         ↓
   Supabase Auth (login/register)
         ↓
   [Protected Routes] /dashboard, /admin
         ↓
   Supabase DB (profiles, subscriptions, payments, tickets, chat, crm_notes)
         ↓
   User selects plan → "Place Order" (no payment on site)
         ↓
   System creates payment record (status = 'pending_instruction')
         ↓
   Resend sends email to user with payment instructions (bank details, WhatsApp contact)
         ↓
   User makes manual payment (bank transfer, etc.)
         ↓
   User notifies admin (via support ticket or WhatsApp) OR admin manually marks paid
         ↓
   Admin dashboard: mark payment as 'confirmed' → activate subscription
         ↓
   Supabase updates subscription status to 'active'
         ↓
   User dashboard shows active subscription
```

### 2.2 Development Workflow (GitHub + Netlify)

1. Developer creates feature branch from `main` (e.g., `feature/payments`).
2. Pushes to GitHub → Netlify automatically builds a preview deployment.
3. After code review and testing, merge via Pull Request.
4. Merge to `main` triggers Netlify production build.
5. Environment variables managed exclusively in Netlify UI (no `.env` committed).

---

## 3. Supabase Database Architecture (Updated for Manual Payments)

All tables reference `auth.users` via `user_id`. Row Level Security (RLS) enforced.

### Table: `profiles`
| Column         | Type                     | Description                        |
|----------------|--------------------------|------------------------------------|
| id             | UUID (PK, ref auth.users) |                                    |
| full_name      | TEXT                     |                                    |
| avatar_url     | TEXT                     |                                    |
| phone          | TEXT                     | Optional for WhatsApp notifications|
| country_code   | TEXT                     | From IP on signup                  |
| is_blocked     | BOOLEAN                  | Default false                      |
| created_at     | TIMESTAMPTZ              |                                    |
| updated_at     | TIMESTAMPTZ              |                                    |

### Table: `subscriptions`
| Column                  | Type                     | Description                         |
|-------------------------|--------------------------|-------------------------------------|
| id                      | UUID (PK)                |                                     |
| user_id                 | UUID (FK → profiles.id)  |                                     |
| plan_type               | TEXT                     | ‘Starter’, ‘Confort’, ‘Premium’     |
| status                  | TEXT                     | ‘pending_payment’, ‘active’, ‘canceled’, ‘expired’ |
| current_period_start    | TIMESTAMPTZ              | When subscription becomes active    |
| current_period_end      | TIMESTAMPTZ              | Expiry date (1 month after activation) |
| created_at              | TIMESTAMPTZ              | Order creation time                 |
| updated_at              | TIMESTAMPTZ              |                                     |

### Table: `payment_instructions` (new)
Stores the instruction text for each plan (admin editable).

| Column         | Type                     | Description                         |
|----------------|--------------------------|-------------------------------------|
| id             | UUID (PK)                |                                     |
| plan_type      | TEXT                     | ‘Starter’, ‘Confort’, ‘Premium’     |
| instruction_text | TEXT                   | Email/WhatsApp payment instructions |
| bank_details   | TEXT                     | Bank account info                   |
| whatsapp_number| TEXT                     | Optional contact for manual payment |
| updated_at     | TIMESTAMPTZ              |                                     |

### Table: `payments`
| Column                    | Type                     | Description                         |
|---------------------------|--------------------------|-------------------------------------|
| id                        | UUID (PK)                |                                     |
| user_id                   | UUID (FK → profiles.id)  |                                     |
| subscription_id           | UUID (FK → subscriptions.id) | Links to the order              |
| amount                    | INTEGER                  | In cents (e.g., 1999)               |
| currency                  | TEXT                     | ‘eur’                               |
| status                    | TEXT                     | ‘pending_instruction’, ‘pending_confirmation’, ‘confirmed’, ‘failed’ |
| payment_method            | TEXT                     | ‘bank_transfer’, ‘whatsapp’, ‘other’ |
| confirmed_by_admin_id     | UUID (FK → profiles.id)  | Admin who confirmed payment         |
| confirmed_at              | TIMESTAMPTZ              |                                     |
| notes                     | TEXT                     | Admin notes (e.g., “User sent receipt”) |
| created_at                | TIMESTAMPTZ              |                                     |

### Table: `support_tickets`
| Column         | Type                     | Description                         |
|----------------|--------------------------|-------------------------------------|
| id             | UUID (PK)                |                                     |
| user_id        | UUID (FK → profiles.id)  |                                     |
| subject        | TEXT                     |                                     |
| message        | TEXT                     |                                     |
| status         | TEXT                     | ‘open’, ‘in_progress’, ‘closed’     |
| priority       | TEXT                     | ‘low’, ‘medium’, ‘high’             |
| assigned_to    | UUID (FK → profiles.id)  | Admin user ID                       |
| created_at     | TIMESTAMPTZ              |                                     |
| updated_at     | TIMESTAMPTZ              |                                     |

### Table: `chat_messages`
| Column         | Type                     | Description                         |
|----------------|--------------------------|-------------------------------------|
| id             | UUID (PK)                |                                     |
| room_id        | TEXT                     | e.g., ‘user_<uuid>_admin’           |
| sender_id      | UUID (FK → profiles.id)  |                                     |
| message        | TEXT                     |                                     |
| attachment_url | TEXT                     | Optional (Supabase Storage)         |
| is_read        | BOOLEAN                  | Default false                       |
| created_at     | TIMESTAMPTZ              |                                     |

### Table: `crm_notes`
| Column         | Type                     | Description                         |
|----------------|--------------------------|-------------------------------------|
| id             | UUID (PK)                |                                     |
| user_id        | UUID (FK → profiles.id)  | Customer ID                         |
| admin_id       | UUID (FK → profiles.id)  | Admin who wrote note                |
| note           | TEXT                     |                                     |
| created_at     | TIMESTAMPTZ              |                                     |

### Table: `admin_audit_log`
| Column         | Type                     | Description                         |
|----------------|--------------------------|-------------------------------------|
| id             | UUID (PK)                |                                     |
| admin_id       | UUID (FK → profiles.id)  |                                     |
| action         | TEXT                     | e.g., ‘confirm_payment’, ‘extend_subscription’ |
| target_type    | TEXT                     | ‘user’, ‘subscription’, ‘payment’   |
| target_id      | TEXT                     |                                     |
| ip_address     | INET                     |                                     |
| created_at     | TIMESTAMPTZ              |                                     |

### Table: `site_settings`
| Column         | Type                     | Description                         |
|----------------|--------------------------|-------------------------------------|
| key            | TEXT (PK)                | e.g., ‘hero_title’, ‘default_whatsapp’ |
| value          | JSONB                    |                                     |

---

## 4. Payment Flow (Manual) – Detailed Workflow

### 4.1 User Journey

1. **User selects a plan** on the homepage (Starter / Confort / Premium).
2. Clicks “Subscribe” → if not logged in, redirected to `/register` → after login, back to checkout.
3. Checkout page shows:
   - Selected plan and price
   - Form to collect **phone number** (optional, for WhatsApp instructions)
   - “Place Order” button
4. After clicking “Place Order”:
   - System creates a `subscription` record with status = `pending_payment`.
   - System creates a `payment` record with status = `pending_instruction`.
   - System fetches payment instructions for that plan from `payment_instructions` table.
   - **Resend** sends an email to the user containing:
     - Payment instructions (bank transfer details, WhatsApp number)
     - Order summary (plan, amount)
     - Link to `/dashboard` to check status
   - Optionally, if user provided phone, send SMS/WhatsApp message via Twilio/WhatsApp Business API (future enhancement).
5. User makes manual payment (bank transfer, etc.).
6. User **notifies admin** via:
   - Support ticket (recommended)
   - WhatsApp message to provided number
   - Or simply waits (admin will periodically check bank statements – but better to have user confirmation)
7. **Admin** logs into `/admin/payments`, sees pending payments.
8. Admin marks payment as `confirmed` (optionally add notes, e.g., “Received transfer from John”).
9. System updates `subscription.status` to `active`, sets `current_period_start = now()`, `current_period_end = now() + 1 month`.
10. User receives **activation email** via Resend.
11. User dashboard shows active subscription with expiry date.

### 4.2 Admin Actions for Payments

- **List pending payments** with user info, plan, created date.
- **Confirm payment** → opens modal:
  - Confirm amount matches (admin can edit if partial payment)
  - Set subscription start date (default today)
  - Add internal note (optional)
- **Reject payment** → changes status to `failed`, sends email to user.
- **Resend instructions** – manually trigger email with payment instructions.

---

## 5. Admin Dashboard – Enhanced Full‑Featured Version

> **Access:** `/admin` – protected by Supabase custom claim `is_admin = true`.  
> **UI Framework:** Next.js + Tailwind CSS + shadcn/ui.  
> **Real‑time:** Supabase Realtime for live updates (pending payments, new tickets, chat messages).

### 5.1 Dashboard Home (Analytics Hub)

- **KPI cards**:
  - Active subscriptions (current)
  - Pending payments (awaiting confirmation)
  - New users this week
  - Churn rate (subscriptions expired vs renewed)
- **Revenue chart** (based on `confirmed` payments, grouped by day/week/month) – even without Stripe, you can track expected vs collected.
- **Pending payments alert** – red banner if >10 pending.
- **Recent activity feed** (new signups, payment confirmations, tickets opened).

### 5.2 Payment & Subscription Management

**Page:** `/admin/subscriptions`

- **Subscriptions table** with columns: User, Plan, Status (pending_payment / active / canceled / expired), Order date, Expiry date, Actions.
- **Filters**: Status, Plan, Date range.
- **Bulk actions**: Export CSV, send reminder email to pending payments.
- **Single‑row actions**:
  - **Confirm payment** (for pending subscriptions) – same modal as above.
  - **View user profile**.
  - **Manually extend/cancel** subscription (for active ones).
  - **Resend payment instructions** (for pending).
- **Separate Payments tab**:
  - List all payment records with status, amount, confirmation date, confirming admin.
  - Filter by user, status, date.

### 5.3 Customer CRM

**Page:** `/admin/customers`

- **Customer list** with search, filter by subscription status.
- **Customer profile** (click to open):
  - **Left**: Personal info, phone, subscription details.
  - **Tabs**:
    - **Payments** – list of all payment attempts with confirm status.
    - **Subscriptions** – history of subscription orders.
    - **Tickets** – support tickets.
    - **Chat** – live chat transcript.
    - **Notes** – internal CRM notes.
  - **Actions**: Send payment reminder, block user, impersonate login.

### 5.4 Live Chat Agent Dashboard

**Page:** `/admin/chat`

- **Left sidebar**: List of active rooms (users currently online or with messages in last 24h). Unread badge.
- **Main area**: Chat window showing message history (Supabase Realtime subscription).
- **Agent capabilities**:
  - Typing indicator.
  - Send attachments (image/file) via Supabase Storage.
  - Close chat (moves room to “resolved” status – no longer in active list).
  - Transfer to another agent.
  - Insert canned responses (pre‑defined templates).
- **Chat insights**: Average response time per agent, total chats handled.

### 5.5 Content Management (Sanity)

**Page:** `/admin/content`

- Blog posts, testimonials, FAQ (via Sanity).
- **Payment instructions editor** (new):
  - For each plan (Starter, Confort, Premium), edit:
    - Instruction text (rich text)
    - Bank details
    - WhatsApp number (override global)
  - Preview how email will look.

### 5.6 System Configuration

**Page:** `/admin/settings`

- **General**: Site name, support email, default WhatsApp number for payments.
- **Email templates** (Resend):
  - `payment_instructions` – editable email template (includes placeholders for plan, amount, instructions).
  - `subscription_activated` – email sent when admin confirms payment.
  - `payment_reminder` – manual or automatic reminder.
- **Webhook logs** (only for Sanity if used).
- **Cache control**: Purge Next.js cache.

### 5.7 User & Role Management

**Page:** `/admin/users`

- **List of admin users** (from `profiles` where `is_admin = true`).
- **Invite new admin**: Send email via Resend with magic link to set password.
- **Assign roles**: Super Admin, Support Agent, Content Editor, Finance.
- **Audit log** view with filters (admin name, action type, date range).

### 5.8 Notifications & Alerts

- In‑app bell for new pending payments, new support tickets, expiring subscriptions (3 days left).
- Slack webhook optional.

---

## 6. Frontend Pages & User Journeys

| Page                  | Route           | Description                                                                 |
|-----------------------|----------------|-----------------------------------------------------------------------------|
| Home                  | `/`            | Hero, features, pricing, testimonials, FAQ                                  |
| Pricing               | `/pricing`     | Redirect to home with pricing anchor                                        |
| Checkout              | `/checkout`    | Plan summary, collect phone (optional), “Place Order” button                |
| Order confirmation    | `/order/confirmation` | Shows “Payment instructions sent to your email”                         |
| Blog index            | `/blog`        | Sanity posts                                                               |
| Blog post             | `/blog/[slug]` | Dynamic page                                                               |
| Register              | `/register`    | Email/password + name + optional phone                                     |
| Login                 | `/login`       | Supabase Auth                                                              |
| Dashboard             | `/dashboard`   | Shows subscription status, expiry, payment history, “Pay Now” button if pending, support ticket form |
| Support               | `/support`     | Create ticket                                                              |
| Live Chat (widget)    | Global overlay | Real‑time chat with admin                                                  |
| Admin Dashboard       | `/admin`       | All admin features                                                         |
| Terms / Privacy       | `/terms`, `/privacy` | Static pages                                                          |

---

## 7. Email Automation (Resend)

All emails use Resend with React Email templates.

| Event                          | Email Type               | Recipient | Trigger                                                                 |
|--------------------------------|--------------------------|-----------|-------------------------------------------------------------------------|
| User registers                 | Welcome email            | User      | After Supabase signup                                                   |
| User places order              | Payment instructions     | User      | After `payment` record created (status = pending_instruction)           |
| Admin confirms payment         | Subscription activated   | User      | After admin sets payment status = confirmed and subscription = active   |
| Payment reminder               | Reminder to pay          | User      | Manual from admin, or cron job 3 days after order with no confirmation  |
| Support ticket created         | Ticket confirmation      | User      | After insert into `support_tickets`                                     |
| Admin replies to ticket        | Support reply            | User      | When ticket status changes + note added                                 |
| Password reset                 | Reset link               | User      | Supabase built‑in (customizable with Resend)                            |

---

## 8. Netlify Deployment & Configuration

### 8.1 Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `.next`

### 8.2 Environment Variables (Required)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   (for admin actions)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
# Optional for WhatsApp integration
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
```

### 8.3 Serverless Functions
- API route `/api/send-payment-instructions` (called after order)
- API route `/api/resend-webhook` (optional)
- API route `/api/admin/confirm-payment` (protected, for admin dashboard)

### 8.4 Custom Domain
Configure in Netlify DNS.

---

## 9. GitHub Repository Structure

```
iptv-clone/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── subscriptions/
│   │   ├── payments/
│   │   ├── chat/
│   │   ├── content/
│   │   ├── settings/
│   ├── blog/
│   │   ├── page.tsx
│   │   ├── [slug]/page.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   ├── support/
│   │   ├── page.tsx
│   ├── api/
│   │   ├── send-payment-instructions/
│   │   ├── admin/confirm-payment/
│   │   ├── resend-webhook/
│   ├── layout.tsx
│   ├── page.tsx
├── components/
│   ├── ui/
│   ├── chat/
│   ├── dashboard/
│   ├── admin/
├── lib/
│   ├── supabase/
│   ├── sanity/
│   ├── resend/
├── sanity/
│   ├── schemas/
│   ├── sanity.config.ts
├── types/
├── public/
├── .env.local (ignored)
├── netlify.toml
├── package.json
└── README.md
```

---

## 10. Success Criteria & Acceptance Tests

| Feature                               | Test                                                                 |
|---------------------------------------|----------------------------------------------------------------------|
| User registration & login             | User signs up, receives welcome email, logs in.                      |
| Place order without payment           | User selects plan, clicks “Place Order” → receives payment instructions email. |
| Payment record created                | `payments` table shows `pending_instruction` status.                 |
| Admin confirms payment                | Admin marks payment confirmed → subscription becomes active, user receives activation email. |
| User dashboard reflects active status | Dashboard shows expiry date, “Cancel subscription” button.           |
| Admin analytics                       | Dashboard shows pending payments count and revenue from confirmed payments. |
| Live chat                             | User sends message → admin sees in real time.                        |
| CRM notes & tickets                   | Admin adds internal note → visible in customer profile.              |
| RLS security                          | User cannot access another user’s data.                              |
| Netlify deployment                    | Push to `main` → auto deploys.                                       |

---

## 11. Future Enhancements (V2)

- **Automatic payment confirmation** via bank statement parsing (webhook from bank – unlikely).
- **WhatsApp Business API** integration to send payment instructions directly.
- **Partial payments** and layaway plans.
- **Invoice generation** (PDF) without Stripe – using a library like `react-pdf`.
- **Multi‑currency support** with manual conversion.

---

## 12. Conclusion

This revised PRD removes all Stripe dependencies and replaces online payment with a manual instruction flow. The admin dashboard is fully equipped to manage pending payments, confirmations, and subscription activations. All other features (live chat, CRM, content management, analytics) remain intact.

**The development team must follow this document exactly, with special attention to the payment confirmation workflow and the admin dashboard’s payment management section.**
```

