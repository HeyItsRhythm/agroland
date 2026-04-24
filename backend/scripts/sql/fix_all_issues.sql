-- Fix all issues in one SQL script

-- 1. Create system_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approvalRequired BOOLEAN DEFAULT true,
  autoExpireDays INTEGER DEFAULT 90,
  maxImagesPerProperty INTEGER DEFAULT 10,
  allowedPropertyTypes TEXT[] DEFAULT ARRAY['agricultural', 'residential', 'commercial', 'industrial'],
  featuredPropertiesLimit INTEGER DEFAULT 5,
  notifyAdminOnNewProperty BOOLEAN DEFAULT true,
  notifySellerOnApproval BOOLEAN DEFAULT true,
  maintenanceMode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on system_settings table
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view system settings
CREATE POLICY IF NOT EXISTS "System settings are viewable by admins" 
    ON public.system_settings 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    ));

-- Only admins can update system settings
CREATE POLICY IF NOT EXISTS "System settings are updatable by admins" 
    ON public.system_settings 
    FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    ));

-- Only admins can insert system settings
CREATE POLICY IF NOT EXISTS "System settings are insertable by admins" 
    ON public.system_settings 
    FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    ));

-- Insert default system settings if none exist
INSERT INTO public.system_settings (
    approvalRequired,
    autoExpireDays,
    maxImagesPerProperty,
    allowedPropertyTypes,
    featuredPropertiesLimit,
    notifyAdminOnNewProperty,
    notifySellerOnApproval,
    maintenanceMode
) 
SELECT 
    true,
    90,
    10,
    ARRAY['agricultural', 'residential', 'commercial', 'industrial'],
    5,
    true,
    true,
    false
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings);

-- 2. Fix property_status enum issue
-- First, check if the enum type exists
DO $$
BEGIN
    -- Check if the enum type exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
        -- Check if 'pending_approval' is in the enum
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_status')
            AND enumlabel = 'pending_approval'
        ) THEN
            -- Add 'pending_approval' to the enum
            ALTER TYPE public.property_status ADD VALUE IF NOT EXISTS 'pending_approval';
        END IF;
    ELSE
        -- Create the enum type if it doesn't exist
        CREATE TYPE public.property_status AS ENUM ('active', 'sold', 'pending', 'expired', 'pending_approval');
    END IF;
END
$$;

-- 3. Fix user profiles issue
-- Create function to ensure user profiles exist
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if profile already exists
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = NEW.id) THEN
    -- Create profile
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')::public.user_role
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_profile();

-- Create trigger for existing users
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_profile();


