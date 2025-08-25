-- Missing Views and Functions for Stripe Connect SaaS Platform
-- This fixes the missing database objects referenced in the application code

-- Create customer_ltv view that the customers list API expects
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
    COUNT(s.id) as subscription_count,
    COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_subscriptions
FROM customers c
LEFT JOIN subscriptions s ON c.id = s.customer_id
GROUP BY c.id, c.developer_id, c.stripe_customer_id, c.email, c.name, c.created_at, c.updated_at;

-- Create get_customer_history function that the customer details API expects
CREATE OR REPLACE FUNCTION get_customer_history(customer_uuid UUID)
RETURNS TABLE (
    subscription_id UUID,
    product_name TEXT,
    amount INTEGER,
    currency TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id as subscription_id,
        p.name as product_name,
        s.amount,
        s.currency,
        s.status,
        s.created_at,
        s.current_period_start,
        s.current_period_end
    FROM subscriptions s
    JOIN products p ON s.product_id = p.id
    WHERE s.customer_id = customer_uuid
    ORDER BY s.created_at DESC;
END;
$$;

-- Create connected_accounts table that the stripe accounts API expects
CREATE TABLE connected_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    stripe_account_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    business_name TEXT,
    onboarding_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (id)
);

-- Add foreign key constraint
ALTER TABLE connected_accounts ADD CONSTRAINT fk_connected_accounts_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;

-- Add RLS policy
CREATE POLICY "Users can manage own connected accounts" ON connected_accounts 
USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_connected_accounts_user_id ON connected_accounts(user_id);
CREATE INDEX idx_connected_accounts_stripe_account_id ON connected_accounts(stripe_account_id);
