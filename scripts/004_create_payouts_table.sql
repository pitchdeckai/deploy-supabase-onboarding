-- Create payouts table for tracking payout history to developers
CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- in cents
  stripe_transfer_id TEXT UNIQUE,
  stripe_payout_id TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Allow developers to view their own payouts
CREATE POLICY "Allow developers to view their own payouts" 
  ON payouts FOR SELECT 
  USING (
    developer_id IN (
      SELECT id FROM developers WHERE user_id = auth.uid()
    )
  );

-- Allow service role to manage all payout records
CREATE POLICY "Allow service role full access to payouts" 
  ON payouts FOR ALL 
  USING (current_setting('role') = 'service_role');
