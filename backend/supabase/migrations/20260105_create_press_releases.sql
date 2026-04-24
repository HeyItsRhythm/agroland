-- Create press_releases table
CREATE TABLE IF NOT EXISTS public.press_releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_gu TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_gu TEXT NOT NULL,
  content_en TEXT,
  content_gu TEXT,
  image_url TEXT NOT NULL,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on published_date for faster queries
CREATE INDEX IF NOT EXISTS idx_press_releases_published_date ON public.press_releases(published_date DESC);

-- Create index on is_published for filtering
CREATE INDEX IF NOT EXISTS idx_press_releases_is_published ON public.press_releases(is_published);

-- Enable Row Level Security
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published press releases
CREATE POLICY "Anyone can view published press releases"
  ON public.press_releases
  FOR SELECT
  USING (is_published = true);

-- Policy: Only admins can insert press releases
CREATE POLICY "Admins can insert press releases"
  ON public.press_releases
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Only admins can update press releases
CREATE POLICY "Admins can update press releases"
  ON public.press_releases
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Only admins can delete press releases
CREATE POLICY "Admins can delete press releases"
  ON public.press_releases
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_press_releases_updated_at BEFORE UPDATE ON public.press_releases
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.press_releases (title_en, title_gu, summary_en, summary_gu, image_url, published_date) VALUES
('AgroLand Portal Launches in Gujarat', 'AgroLand પોર્ટલ ગુજરાતમાં લોન્ચ થયું', 
 'AgroLand Portal, Gujarat''s first dedicated agricultural land marketplace, officially launches with over 500 property listings.',
 'AgroLand પોર્ટલ, ગુજરાતનું પ્રથમ સમર્પિત કૃષિ જમીન માર્કેટપ્લેસ, 500 થી વધુ પ્રોપર્ટી લિસ્ટિંગ સાથે આધિકારિક રીતે લોન્ચ થયું.',
 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
 '2023-06-15'),
 
('AgroLand Portal Secures ₹5 Crore in Seed Funding', 'AgroLand પોર્ટલે ₹5 કરોડનું સીડ ફંડિંગ સુરક્ષિત કર્યું',
 'Agricultural land marketplace AgroLand Portal has raised ₹5 crore in seed funding to expand its operations across Gujarat.',
 'કૃષિ જમીન માર્કેટપ્લેસ AgroLand પોર્ટલે ગુજરાત ભરમાં તેના કામગીરી વિસ્તારવા માટે ₹5 કરોડનું સીડ ફંડિંગ ઊભું કર્યું છે.',
 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
 '2023-08-22');
