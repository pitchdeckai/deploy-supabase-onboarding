-- Create customer_attributions table for tracking which developer brought which customer
CREATE TABLE IF NOT EXISTS customer_attributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
  attribution_percentage DECIMAL DEFAULT 70.0, -- Developer gets 70% by default
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE customer_attributions ENABLE ROW LEVEL SECURITY;

-- Allow developers to view their own attributions
CREATE POLICY "Allow developers to view their own attributions" 
  ON customer_attributions FOR SELECT 
  USING (
    developer_id IN (
      SELECT id FROM developers WHERE user_id = auth.uid()
    )
  );

-- Allow service role to manage all attribution records
CREATE POLICY "Allow service role full access to customer_attributions" 
  ON customer_attributions FOR ALL 
  USING (current_setting('role') = 'service_role');
