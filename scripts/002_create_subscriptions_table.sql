-- Create subscriptions table for tracking SaaS subscriptions on the platform account
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  customer_email TEXT,
  amount INTEGER NOT NULL, -- in cents
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage all subscription records (platform manages these)
CREATE POLICY "Allow service role full access to subscriptions" 
  ON subscriptions FOR ALL 
  USING (current_setting('role') = 'service_role');

-- Allow authenticated users to view subscriptions (for reporting)
CREATE POLICY "Allow authenticated users to view subscriptions" 
  ON subscriptions FOR SELECT 
  TO authenticated 
  USING (true);
