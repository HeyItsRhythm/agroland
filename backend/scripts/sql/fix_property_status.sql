-- Fix property_status enum issue

-- Check if the enum type exists and add the value if needed
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
      RAISE NOTICE 'Added pending_approval to property_status enum';
    ELSE
      RAISE NOTICE 'pending_approval already exists in property_status enum';
    END IF;
  ELSE
    -- Create the enum type if it doesn't exist
    CREATE TYPE public.property_status AS ENUM ('active', 'sold', 'pending', 'expired', 'pending_approval');
    RAISE NOTICE 'Created property_status enum with pending_approval value';
  END IF;
  
  -- Update any properties with invalid status
  UPDATE properties 
  SET status = 'pending' 
  WHERE status::text = 'pending_approval' AND 
        NOT EXISTS (
          SELECT 1 FROM pg_enum 
          WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_status')
          AND enumlabel = 'pending_approval'
        );
  
  -- If we updated any rows, log it
  IF FOUND THEN
    RAISE NOTICE 'Updated properties with invalid status to pending';
  END IF;
END
$$;


