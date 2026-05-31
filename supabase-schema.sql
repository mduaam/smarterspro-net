-- ==========================================
-- 1. EXTENSIONS & TABLES SETUP
-- ==========================================

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    country_code TEXT,
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_type TEXT NOT NULL, -- 'Starter', 'Confort', 'Premium', 'Pack2'
    status TEXT DEFAULT 'pending_payment'::text NOT NULL, -- 'pending_payment', 'active', 'canceled', 'expired'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- In cents (e.g. 1999 = 19.99 EUR)
    currency TEXT DEFAULT 'eur'::text NOT NULL,
    status TEXT DEFAULT 'pending_instruction'::text NOT NULL, -- 'pending_instruction', 'pending_confirmation', 'confirmed', 'failed'
    payment_method TEXT DEFAULT 'bank_transfer'::text NOT NULL, -- 'bank_transfer', 'whatsapp', 'other'
    confirmed_by_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: support_tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open'::text NOT NULL, -- 'open', 'in_progress', 'closed'
    priority TEXT DEFAULT 'medium'::text NOT NULL, -- 'low', 'medium', 'high'
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT NOT NULL, -- e.g. 'user_[uuid]_admin'
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: crm_notes
CREATE TABLE IF NOT EXISTS public.crm_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: admin_audit_log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL, -- e.g. 'confirm_payment', 'block_user'
    target_type TEXT NOT NULL, -- 'user', 'subscription', 'payment'
    target_id TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- Insert default admin configurations
INSERT INTO public.site_settings (key, value) VALUES
('default_whatsapp', '"+33 6 12 34 56 78"')
ON CONFLICT (key) DO NOTHING;

-- ==========================================
-- 2. AUTOMATIC PROFILE CREATION ON SIGNUP
-- ==========================================

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone, country_code, is_blocked)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Client IPTV'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone',
    'FR', -- Default country
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run handle_new_user() on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 3. SECURITY & ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3.1 Profiles RLS Policies
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can edit own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service-role and admins can do all on profiles" ON public.profiles
    FOR ALL USING (
        (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );

-- 3.2 Subscriptions RLS Policies
CREATE POLICY "Users can read own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service-role and admins can do all on subscriptions" ON public.subscriptions
    FOR ALL USING (
        (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );

-- 3.3 Payments RLS Policies
CREATE POLICY "Users can read own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can do all on payments" ON public.payments
    FOR ALL USING (
        (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );

-- 3.4 Support Tickets RLS Policies
CREATE POLICY "Users can read own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can do all on support tickets" ON public.support_tickets
    FOR ALL USING (
        (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );

-- 3.5 Chat Messages RLS Policies
CREATE POLICY "Users can read own chat room messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = sender_id OR room_id = 'user_' || auth.uid()::text || '_admin');

CREATE POLICY "Users can write own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Admins can do all on chat messages" ON public.chat_messages
    FOR ALL USING (
        (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );

-- 3.6 Settings, Notes, Audit Logs
CREATE POLICY "Everyone can read settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Only admins can edit settings" ON public.site_settings
    FOR ALL USING (
        (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );

CREATE POLICY "Only admins can handle crm notes" ON public.crm_notes
    FOR ALL USING (
        (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );

CREATE POLICY "Only admins can view audit logs" ON public.admin_audit_log
    FOR ALL USING (
        (SELECT (raw_user_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid()) = true
    );
