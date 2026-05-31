# Production Deployment & Integration Guide
## IPTV Smarters Pro Officiel Portal

This document outlines the step-by-step procedure to connect **Supabase**, **Resend**, **Sanity.io**, and **Netlify** under your custom domain `iptvsmartersprofficiel.com`. Follow these five main steps in sequence.

---

## 🛠️ Step 1: Connect and Initialize Supabase

Supabase handles User Authentication, Account Roles, Subscriptions, Payments, Support Tickets, and Live Chat.

### A. Create Your Supabase Project
1. Log in to [Supabase Console](https://supabase.com).
2. Click **New Project** and select your organization.
3. Enter your project details:
   - **Name**: `IPTV Smarters Pro Officiel`
   - **Database Password**: *Choose a secure password and save it.*
   - **Region**: Select `West Europe (Paris)` or closest region.
4. Click **Create new project** and wait 2-3 minutes for the database to provision.

### B. Run the Database Schema
1. In the left-hand menu, click on the **SQL Editor** tab (represented by a query terminal icon `>_`).
2. Click **New Query**.
3. Copy the contents of the `supabase-schema.sql` file located in the root of your project directory.
4. Paste it directly into the editor and click the **Run** button at the bottom-right.
5. You should see a success response: `Success. No rows returned.` All 8 tables, automatic profile triggers, and Row Level Security (RLS) policies are now initialized!

### C. Elevate Your User to Administrator
To log in and access the Administrative CRM Dashboard (`/admin`), your user account must have the administrative flag `is_admin = true` inside the Supabase metadata.
1. When you register your account on the live website later, go back to your **Supabase Dashboard**.
2. Go to **Authentication** -> **Users** to find your registered email.
3. Go to the **SQL Editor** -> **New Query**, run the following SQL, and click **Run**:
   ```sql
   -- Replace 'YOUR_USER_ID_HERE' with the UUID of your user from Auth -> Users
   UPDATE auth.users 
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb 
   WHERE id = 'YOUR_USER_ID_HERE';
   ```

### D. Retrieve API Keys
1. In your Supabase sidebar, go to **Project Settings** (gear icon) -> **API**.
2. Copy the following keys for Step 4:
   - **Project URL** (e.g., `https://xxxxxx.supabase.co`)
   - **anon public** key (API Key)
   - **service_role** key (Secret API Key - *keep this secure!*)

---

## 📧 Step 2: Configure Resend for Transactional Emails

Resend handles sending welcome emails, manual payment instructions, and subscription activation notifications.

### A. Register and Get API Key
1. Go to [Resend](https://resend.com) and create a free account.
2. Click on **API Keys** in the sidebar.
3. Click **Create API Key**, name it `Smarters Pro Production`, and copy the key (e.g. `re_xxxxx`). Keep it for Step 4.

### B. Verify Your Custom Domain (Crucial for Spam Prevention)
To send emails from your official domain (e.g. `contact@iptvsmartersprofficiel.com`):
1. In Resend, go to the **Domains** tab in the sidebar.
2. Click **Add Domain**, enter `iptvsmartersprofficiel.com`, and select your region.
3. Resend will generate three **DNS Records** (DKIM and SPF records).
4. Log into your domain registrar (GoDaddy, Namecheap, OVH, etc.), navigate to your **DNS Settings**, and add these 3 TXT/CNAME records exactly as shown.
5. In Resend, click **Verify**. Once verified, emails will send with maximum inbox deliverability.

---

## 🎨 Step 3: Sanity.io Configuration (Optional Headless CMS)

The blog at `/blog` and `/blog/[slug]` is pre-configured to run with high-performance static/dynamic routes. If you wish to manage additional sections via Sanity:
1. Initialize a new Sanity project by running:
   ```bash
   npx sanity@latest init
   ```
2. Copy the resulting `projectId` from the command line or from your [Sanity Manage Dashboard](https://www.sanity.io/manage).
3. Set your dataset to `production`.

---

## 🚀 Step 4: Deploy Your Project on Netlify

Netlify hosts your Next.js frontend and executes the serverless backend endpoints.

### A. Connect to GitHub
1. Push your local codebase to a new private repository on your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: complete production modular iptv platform"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### B. Create Project on Netlify
1. Log in to [Netlify](https://www.netlify.com).
2. Click **Add new site** -> **Import an existing project** -> Choose **GitHub**.
3. Select your repository `YOUR_REPO_NAME`.
4. Leave the default build settings as they are:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next` (or leave default blank; Netlify automatically detects Next.js configurations).

### C. Input Environment Variables (Do NOT skip this!)
Before clicking Deploy, click **Advanced Build Settings** -> **Environment variables** -> **Add Variables**. Set the following variables exactly:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | *Your Supabase Project URL* | Public URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Your Supabase anon Key* | Public Key |
| `SUPABASE_SERVICE_ROLE_KEY` | *Your Supabase service_role Key* | Secret Admin Key |
| `RESEND_API_KEY` | *Your Resend API Key (`re_...`)* | Secret Email Key |
| `NEXT_PUBLIC_SITE_URL` | `https://iptvsmartersprofficiel.com` | Your live production domain |

5. Click **Deploy Site**. Netlify will automatically compile, optimize, and serve your application!

---

## 🌐 Step 5: Map Your Custom Domain

Make your site accessible to the public under your official brand domain.

### A. Add Domain on Netlify
1. In your Netlify site dashboard, go to **Site configuration** -> **Domain management**.
2. Click **Add custom domain**.
3. Enter `iptvsmartersprofficiel.com` (and click **Verify/Yes, add domain**).

### B. Update Registrar DNS Settings
To route traffic from your domain to Netlify, configure your registrar DNS settings:

1. **Option A: Netlify DNS (Recommended)**
   - Netlify will show you 4 custom Nameservers (e.g. `dns1.p01.nsone.net`).
   - Log into your domain registrar, find the **Nameservers** section, and replace your registrar defaults with Netlify's 4 custom Nameservers.

2. **Option B: Standard A & CNAME Records (If keeping existing registrar DNS)**
   - Add a new **A Record** pointing to Netlify's load balancer IP: `75.101.145.82` (Name/Host = `@`).
   - Add a new **CNAME Record** pointing to your Netlify subdomain (e.g., `your-site.netlify.app`, Name/Host = `www`).

### C. Enable SSL Certificate
1. Once DNS records have propagated (takes 5-15 minutes), scroll to the bottom of Netlify's **Domain management** page.
2. Click **Verify DNS configuration** under the SSL section.
3. Click **Provision Certificate** to obtain a free, auto-renewing HTTPS certificate from Let's Encrypt.

---

### 🎉 Your IPTV Smarters Pro portal is now live, securely protected, and open for business!
