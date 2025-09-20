-- Consolidated Database Schema for Stripe Connect SaaS Platform
-- Generated automatically on 2025-07-30.basil

CREATE TABLE commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  subscription_id UUID,
  developer_id UUID,
  commission_percentage NUMERIC DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  credit_id UUID,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE credits (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  developer_id UUID,
  balance INTEGER DEFAULT 0,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE customers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  developer_id UUID,
  stripe_customer_id TEXT,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE developer_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  developer_id UUID,
  plan_id UUID,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active'::text,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE developers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT NOT NULL,
  name TEXT,
  stripe_account_id TEXT,
  onboarding_complete BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  business_name TEXT,
  business_type TEXT,
  stripe_account_status TEXT DEFAULT 'pending'::text,
  charges_enabled BOOLEAN DEFAULT false,
  requirements_pending ARRAY,
  PRIMARY KEY (id)
);

CREATE TABLE payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  developer_id UUID,
  amount INTEGER NOT NULL,
  stripe_transfer_id TEXT,
  stripe_payout_id TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'pending'::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  currency TEXT DEFAULT 'usd'::text,
  PRIMARY KEY (id)
);

CREATE TABLE products (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  connected_account_id TEXT NOT NULL,
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd'::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  developer_id UUID,
  interval TEXT,
  active BOOLEAN DEFAULT true,
  PRIMARY KEY (id)
);

CREATE TABLE subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd'::text,
  interval TEXT NOT NULL,
  features JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  stripe_subscription_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  customer_email TEXT,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  developer_id UUID,
  product_id UUID,
  customer_id UUID,
  connected_account_id TEXT,
  currency TEXT DEFAULT 'usd'::text,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id)
);

-- Foreign Key Constraints
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_subscription_id FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE credit_transactions ADD CONSTRAINT fk_credit_transactions_credit_id FOREIGN KEY (credit_id) REFERENCES credits(id);
ALTER TABLE credits ADD CONSTRAINT fk_credits_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE customers ADD CONSTRAINT fk_customers_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE developer_subscriptions ADD CONSTRAINT fk_developer_subscriptions_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE developer_subscriptions ADD CONSTRAINT fk_developer_subscriptions_plan_id FOREIGN KEY (plan_id) REFERENCES subscription_plans(id);
ALTER TABLE payouts ADD CONSTRAINT fk_payouts_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE products ADD CONSTRAINT fk_products_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_product_id FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id);

-- Indexes for performance
CREATE INDEX idx_developers_user_id ON developers(user_id);
CREATE INDEX idx_developers_stripe_account_id ON developers(stripe_account_id);
CREATE INDEX idx_customers_developer_id ON customers(developer_id);
CREATE INDEX idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX idx_subscriptions_developer_id ON subscriptions(developer_id);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_product_id ON subscriptions(product_id);
CREATE INDEX idx_products_developer_id ON products(developer_id);
CREATE INDEX idx_payouts_developer_id ON payouts(developer_id);
CREATE INDEX idx_commissions_developer_id ON commissions(developer_id);
CREATE INDEX idx_commissions_subscription_id ON commissions(subscription_id);

-- Row Level Security Policies
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for developers table
CREATE POLICY "Developers can view own data" ON developers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Developers can update own data" ON developers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own developer record" ON developers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for customers table
CREATE POLICY "Developers can view own customers" ON customers FOR SELECT USING (
  developer_id IN (SELECT id FROM developers WHERE user_id = auth.uid())
);
CREATE POLICY "Developers can manage own customers" ON customers FOR ALL USING (
  developer_id IN (SELECT id FROM developers WHERE user_id = auth.uid())
);

-- Policies for products table
CREATE POLICY "Developers can view own products" ON products FOR SELECT USING (
  developer_id IN (SELECT id FROM developers WHERE user_id = auth.uid())
);
CREATE POLICY "Developers can manage own products" ON products FOR ALL USING (
  developer_id IN (SELECT id FROM developers WHERE user_id = auth.uid())
);

-- Policies for subscriptions table
CREATE POLICY "Developers can view own subscriptions" ON subscriptions FOR SELECT USING (
  developer_id IN (SELECT id FROM developers WHERE user_id = auth.uid())
);
CREATE POLICY "Developers can manage own subscriptions" ON subscriptions FOR ALL USING (
  developer_id IN (SELECT id FROM developers WHERE user_id = auth.uid())
);

-- Policies for payouts table
CREATE POLICY "Developers can view own payouts" ON payouts FOR SELECT USING (
  developer_id IN (SELECT id FROM developers WHERE user_id = auth.uid())
);

-- Policies for commissions table
CREATE POLICY "Developers can view own commissions" ON commissions FOR SELECT USING (
  developer_id IN (SELECT id FROM developers WHERE user_id = auth.uid())
);
