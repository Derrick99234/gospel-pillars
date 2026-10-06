-- ==============================================================================
-- GOSPEL PILLARS - SUPABASE DATABASE INITIALIZATION SCRIPT
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Sections Table
CREATE TABLE IF NOT EXISTS public.sections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    manager_username TEXT UNIQUE NOT NULL,
    manager_password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Outlets Table
CREATE TABLE IF NOT EXISTS public.outlets (
    id TEXT PRIMARY KEY,
    index INT,
    name TEXT NOT NULL,
    original_heading TEXT,
    region_category TEXT NOT NULL,
    branch_type TEXT,
    venue TEXT,
    address TEXT NOT NULL,
    city TEXT,
    state_or_province TEXT,
    country TEXT,
    postal_code TEXT,
    phone_numbers JSONB DEFAULT '[]'::jsonb,
    landmarks TEXT,
    raw_text TEXT,
    section_id TEXT,
    status TEXT DEFAULT 'approved',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    draft_updated_at TIMESTAMPTZ
);

-- 3. Drafts Table
CREATE TABLE IF NOT EXISTS public.drafts (
    outlet_id TEXT PRIMARY KEY,
    draft_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL,
    section_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    submitted_by TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    changes JSONB NOT NULL,
    admin_notes TEXT,
    reviewed_at TIMESTAMPTZ
);

-- Row Level Security (RLS) Policies
-- Enables public reading, while permitting API route access via service_role or anon
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Allow full write access on sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on outlets" ON public.outlets FOR SELECT USING (true);
CREATE POLICY "Allow full write access on outlets" ON public.outlets FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on drafts" ON public.drafts FOR SELECT USING (true);
CREATE POLICY "Allow full write access on drafts" ON public.drafts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Allow full write access on submissions" ON public.submissions FOR ALL USING (true) WITH CHECK (true);
