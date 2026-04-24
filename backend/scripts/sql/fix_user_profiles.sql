-- Fix user profiles issue

-- 1. Create test users with different roles if they don't exist
DO $$
DECLARE
    admin_count INTEGER;
    seller_count INTEGER;
    buyer_count INTEGER;
BEGIN
    -- Check existing user counts by role
    SELECT COUNT(*) INTO admin_count FROM public.user_profiles WHERE role = 'admin';
    SELECT COUNT(*) INTO seller_count FROM public.user_profiles WHERE role = 'seller';
    SELECT COUNT(*) INTO buyer_count FROM public.user_profiles WHERE role = 'buyer';
    
    -- Log the counts
    RAISE NOTICE 'Current user counts - Admin: %, Seller: %, Buyer: %', admin_count, seller_count, buyer_count;
    
    -- Create test seller if none exists
    IF seller_count = 0 THEN
        RAISE NOTICE 'Creating test seller user';
        -- Insert directly into user_profiles
        INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'testseller@agroland.com',
            'Test Seller',
            'seller',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    -- Create test buyer if none exists
    IF buyer_count = 0 THEN
        RAISE NOTICE 'Creating test buyer user';
        -- Insert directly into user_profiles
        INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'testbuyer@agroland.com',
            'Test Buyer',
            'buyer',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
    
    -- Create default admin if none exists
    IF admin_count = 0 THEN
        RAISE NOTICE 'Creating default admin user';
        -- Insert directly into user_profiles
        INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'admin@agroland.com',
            'Admin User',
            'admin',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
END;
$$;

-- 2. Ensure all auth users have corresponding profiles
DO $$
DECLARE
    auth_user RECORD;
    profile_exists BOOLEAN;
BEGIN
    -- Loop through all auth users
    FOR auth_user IN 
        SELECT id, email, raw_user_meta_data FROM auth.users
    LOOP
        -- Check if profile exists
        SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE id = auth_user.id) INTO profile_exists;
        
        -- If profile doesn't exist, create it
        IF NOT profile_exists THEN
            RAISE NOTICE 'Creating missing profile for user %', auth_user.email;
            
            INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
            VALUES (
                auth_user.id,
                auth_user.email,
                COALESCE(auth_user.raw_user_meta_data->>'full_name', split_part(auth_user.email, '@', 1)),
                COALESCE(auth_user.raw_user_meta_data->>'role', 'buyer')::public.user_role,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            );
        END IF;
    END LOOP;
END;
$$;

-- 3. Create trigger to automatically create profiles for new users
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


