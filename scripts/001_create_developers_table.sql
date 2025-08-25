-- Create developers table for storing Stripe Connect account information
CREATE TABLE IF NOT EXISTS developers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  stripe_account_id TEXT UNIQUE,
  onboarding_complete BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;

-- RLS policies for developers table
CREATE POLICY "Allow users to view their own developer profile" 
  ON developers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own developer profile" 
  ON developers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own developer profile" 
  ON developers FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow service role to manage all developer records (for admin operations)
CREATE POLICY "Allow service role full access to developers" 
  ON developers FOR ALL 
  USING (current_setting('role') = 'service_role');
