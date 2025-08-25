-- Enhance Database Schema for 5% Platform Fee Stripe Connect Model
-- This adds missing tables and columns for proper application fee tracking

-- Add platform fee tracking to subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS platform_fee_amount INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS platform_fee_percent NUMERIC DEFAULT 5.0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS stripe_application_fee_id TEXT;

-- Add application fee tracking to products  
ALTER TABLE products ADD COLUMN IF NOT EXISTS application_fee_percent NUMERIC DEFAULT 5.0;

-- Create application_fees table for detailed platform revenue tracking
CREATE TABLE IF NOT EXISTS application_fees (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    stripe_application_fee_id TEXT NOT NULL UNIQUE,
    stripe_charge_id TEXT,
    stripe_payment_intent_id TEXT,
    subscription_id UUID,
    developer_id UUID NOT NULL,
    connected_account_id TEXT NOT NULL,
    amount INTEGER NOT NULL, -- Platform fee amount in cents
    fee_percent NUMERIC NOT NULL DEFAULT 5.0,
    gross_amount INTEGER NOT NULL, -- Total transaction amount
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending', -- pending, collected, refunded
    stripe_created_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (developer_id) REFERENCES developers(id)
);

-- Create platform_revenue_summary view for easy reporting
CREATE OR REPLACE VIEW platform_revenue_summary AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as transaction_count,
    SUM(amount) as total_platform_fees,
    SUM(gross_amount) as total_gross_revenue,
    AVG(fee_percent) as avg_fee_percent,
    currency
FROM application_fees 
WHERE status = 'collected'
GROUP BY DATE_TRUNC('month', created_at), currency
ORDER BY month DESC;

-- Create stripe_events table for webhook event logging
CREATE TABLE IF NOT EXISTS stripe_events (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    stripe_event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    account_id TEXT, -- For Connect events
    processed BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (id)
);

-- Enhanced payout tracking with platform fee deductions
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS platform_fees_deducted INTEGER DEFAULT 0;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS net_amount INTEGER; -- Amount after platform fees
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS fee_period_start DATE;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS fee_period_end DATE;

-- Create developer_earnings_summary view
CREATE OR REPLACE VIEW developer_earnings_summary AS
SELECT 
    d.id as developer_id,
    d.email,
    d.business_name,
    COUNT(DISTINCT s.id) as total_subscriptions,
    COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.id END) as active_subscriptions,
    COALESCE(SUM(s.amount), 0) as gross_revenue,
    COALESCE(SUM(af.amount), 0) as platform_fees_paid,
    COALESCE(SUM(s.amount) - SUM(af.amount), 0) as net_revenue,
    COALESCE(SUM(p.amount), 0) as total_payouts,
    (COALESCE(SUM(s.amount) - SUM(af.amount), 0) - COALESCE(SUM(p.amount), 0)) as pending_earnings
FROM developers d
LEFT JOIN subscriptions s ON d.id = s.developer_id AND s.status = 'active'
LEFT JOIN application_fees af ON d.id = af.developer_id AND af.status = 'collected'
LEFT JOIN payouts p ON d.id = p.developer_id AND p.status = 'completed'
GROUP BY d.id, d.email, d.business_name;

-- Update commissions table to link with application fees
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS application_fee_id UUID;
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_application_fee_id 
FOREIGN KEY (application_fee_id) REFERENCES application_fees(id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_application_fees_developer_id ON application_fees(developer_id);
CREATE INDEX IF NOT EXISTS idx_application_fees_stripe_fee_id ON application_fees(stripe_application_fee_id);
CREATE INDEX IF NOT EXISTS idx_application_fees_created_at ON application_fees(created_at);
CREATE INDEX IF NOT EXISTS idx_application_fees_status ON application_fees(status);
CREATE INDEX IF NOT EXISTS idx_stripe_events_event_type ON stripe_events(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed ON stripe_events(processed);
CREATE INDEX IF NOT EXISTS idx_subscriptions_platform_fee ON subscriptions(platform_fee_amount);

-- Enable RLS on new tables
ALTER TABLE application_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for application_fees
CREATE POLICY "Platform admins can view all application fees" ON application_fees 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM developers d 
        WHERE d.user_id = auth.uid() 
        AND d.id = application_fees.developer_id
    )
    OR 
    auth.uid() IN (
        SELECT user_id FROM developers WHERE email LIKE '%@yourplatform.com' -- Replace with your admin emails
    )
);

-- RLS Policies for stripe_events (admin only)
CREATE POLICY "Platform admins can manage stripe events" ON stripe_events 
USING (
    auth.uid() IN (
        SELECT user_id FROM developers WHERE email LIKE '%@yourplatform.com' -- Replace with your admin emails
    )
);

-- Update customer_ltv view to include platform fees
DROP VIEW IF EXISTS customer_ltv;
CREATE VIEW customer_ltv AS
SELECT 
    c.id,
    c.developer_id,
    c.stripe_customer_id,
    c.email,
    c.name,
    c.created_at,
    c.updated_at,
    COALESCE(SUM(s.amount), 0) as total_spent,
    COALESCE(SUM(s.platform_fee_amount), 0) as total_platform_fees,
    COALESCE(SUM(s.amount) - SUM(s.platform_fee_amount), 0) as total_developer_revenue,
    COUNT(s.id) as subscription_count,
    COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_subscriptions
FROM customers c
LEFT JOIN subscriptions s ON c.id = s.customer_id
GROUP BY c.id, c.developer_id, c.stripe_customer_id, c.email, c.name, c.created_at, c.updated_at;

-- Comment explaining the schema enhancements
COMMENT ON TABLE application_fees IS 'Tracks platform application fees collected from Stripe Connect transactions';
COMMENT ON VIEW platform_revenue_summary IS 'Monthly summary of platform revenue from application fees';
COMMENT ON VIEW developer_earnings_summary IS 'Summary of developer earnings after platform fees';
COMMENT ON COLUMN subscriptions.platform_fee_amount IS 'Platform fee amount in cents for this subscription';
COMMENT ON COLUMN subscriptions.platform_fee_percent IS 'Platform fee percentage (e.g., 5.0 for 5%)';
