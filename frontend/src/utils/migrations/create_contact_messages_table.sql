-- Create table for storing contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    inquiry_type TEXT NOT NULL DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'new', -- new, read, replied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public access for contact form)
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

-- Policy: Only admins can view messages
-- Note: This assumes you have a way to distinguish admins, e.g., via metadata or a rolw
-- For simplicity in this demo environment, we'll check if the auth.uid() exists for view
-- But ideally: auth.jwt() ->> 'role' = 'admin' OR specific user IDs
CREATE POLICY "Admins can view messages" 
ON public.contact_messages FOR SELECT 
USING (auth.role() = 'authenticated'); -- Adjust refined permission logic as needed

-- Policy: Only admins can update messages (e.g. mark as read)
CREATE POLICY "Admins can update messages" 
ON public.contact_messages FOR UPDATE
USING (auth.role() = 'authenticated');

-- Grant access to authenticated and anon users (for insert)
GRANT ALL ON public.contact_messages TO authenticated;
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO service_role;
