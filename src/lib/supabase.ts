import { createClient } from '@supabase/supabase-js';

// Get credentials from env or local storage
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('ANSH_SUPABASE_URL') || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('ANSH_SUPABASE_ANON_KEY') || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export const ADMIN_EMAIL = 'anshsureshsingh07@gmail.com';

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- SUPABASE COMPLETE DATABASE & STORAGE SCHEMA
-- Author: Ansh Singh (anshsureshsingh07@gmail.com)
-- Storage Bucket: photos
-- ==========================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Profiles are Viewable" ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "Users can edit own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- 3. CREATE TABLE: BOOKS
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  status TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  cover_image TEXT,
  progress_percent INT DEFAULT 0,
  features_list TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for BOOKS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Books are publicly viewable" ON public.books 
  FOR SELECT USING (true);

CREATE POLICY "Only admin can modify books" ON public.books 
  FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') = 'anshsureshsingh07@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'anshsureshsingh07@gmail.com');

-- 4. CREATE TABLE: PHOTOS / GALLERY
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  description TEXT,
  uploaded_by TEXT DEFAULT 'anshsureshsingh07@gmail.com',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for PHOTOS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are publicly viewable" ON public.photos 
  FOR SELECT USING (true);

CREATE POLICY "Only admin can manage photos" ON public.photos 
  FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email') = 'anshsureshsingh07@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'anshsureshsingh07@gmail.com');

-- 5. CREATE TABLE: GUESTBOOK & REVIEWS
CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT 'anshsureshsingh07@gmail.com',
  location TEXT,
  message TEXT NOT NULL,
  rating INT DEFAULT 5,
  book_title TEXT DEFAULT 'General Review',
  badge TEXT DEFAULT 'Reader',
  likes INT DEFAULT 1,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for GUESTBOOK
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guestbook entries viewable" ON public.guestbook 
  FOR SELECT USING (is_approved = true OR (auth.jwt() ->> 'email') = 'anshsureshsingh07@gmail.com');

CREATE POLICY "Anyone can post to guestbook" ON public.guestbook 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can update guestbook" ON public.guestbook 
  FOR UPDATE TO authenticated 
  USING ((auth.jwt() ->> 'email') = 'anshsureshsingh07@gmail.com');

-- 6. CREATE TABLE: CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  target_email TEXT DEFAULT 'anshsureshsingh07@gmail.com',
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'delivered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact message" ON public.contact_messages 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can view contact messages" ON public.contact_messages 
  FOR SELECT TO authenticated 
  USING ((auth.jwt() ->> 'email') = 'anshsureshsingh07@gmail.com');

-- 6. STORAGE BUCKET CONFIGURATION: 'photos'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'photos', 
  'photos', 
  true, 
  10485760, -- 10MB Limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- STORAGE POLICIES FOR BUCKET: 'photos'
CREATE POLICY "Public Read Access for Photos Bucket" ON storage.objects 
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Admin Upload to Photos Bucket" ON storage.objects 
  FOR INSERT TO authenticated 
  WITH CHECK (
    bucket_id = 'photos' AND 
    ((auth.jwt() ->> 'email') = 'anshsureshsingh07@gmail.com' OR (auth.jwt() ->> 'email') IS NOT NULL)
  );

CREATE POLICY "Admin Update Delete Photos Bucket" ON storage.objects 
  FOR ALL TO authenticated 
  USING (bucket_id = 'photos')
  WITH CHECK (bucket_id = 'photos');

-- 7. AUTOMATIC ADMIN PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Ansh Singh'),
    CASE WHEN NEW.email = 'anshsureshsingh07@gmail.com' THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (id) DO UPDATE SET is_admin = (EXCLUDED.email = 'anshsureshsingh07@gmail.com');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;
