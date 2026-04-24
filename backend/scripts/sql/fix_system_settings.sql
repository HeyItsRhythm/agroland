-- Fix system_settings table

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "approvalRequired" BOOLEAN DEFAULT true,
  "autoExpireDays" INTEGER DEFAULT 90,
  "maxImagesPerProperty" INTEGER DEFAULT 10,
  "allowedPropertyTypes" TEXT[] DEFAULT ARRAY['agricultural', 'residential', 'commercial', 'industrial'],
  "featuredPropertiesLimit" INTEGER DEFAULT 5,
  "notifyAdminOnNewProperty" BOOLEAN DEFAULT true,
  "notifySellerOnApproval" BOOLEAN DEFAULT true,
  "maintenanceMode" BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on system_settings table
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view system settings
DROP POLICY IF EXISTS "System settings are viewable by admins" ON public.system_settings;
CREATE POLICY "System settings are viewable by admins" 
    ON public.system_settings 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    ));

-- Only admins can update system settings
DROP POLICY IF EXISTS "System settings are updatable by admins" ON public.system_settings;
CREATE POLICY "System settings are updatable by admins" 
    ON public.system_settings 
    FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    ));

-- Only admins can insert system settings
DROP POLICY IF EXISTS "System settings are insertable by admins" ON public.system_settings;
CREATE POLICY "System settings are insertable by admins" 
    ON public.system_settings 
    FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    ));

-- Insert default system settings if none exist
INSERT INTO public.system_settings (
    "approvalRequired",
    "autoExpireDays",
    "maxImagesPerProperty",
    "allowedPropertyTypes",
    "featuredPropertiesLimit",
    "notifyAdminOnNewProperty",
    "notifySellerOnApproval",
    "maintenanceMode"
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


