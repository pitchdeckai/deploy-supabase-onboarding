-- Local Database Schema Recreation Script
-- Generated automatically on 2025-09-20T16:07:45.878Z

CREATE TABLE application_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  stripe_application_fee_id TEXT NOT NULL,
  stripe_charge_id TEXT,
  stripe_payment_intent_id TEXT,
  subscription_id UUID,
  developer_id UUID NOT NULL,
  connected_account_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  fee_percent NUMERIC NOT NULL DEFAULT 5.0,
  gross_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd'::text,
  status TEXT DEFAULT 'pending'::text,
  stripe_created_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  subscription_id UUID,
  developer_id UUID,
  commission_percentage NUMERIC DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  application_fee_id UUID,
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
  platform_fees_deducted INTEGER DEFAULT 0,
  net_amount INTEGER,
  fee_period_start DATE,
  fee_period_end DATE,
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
  application_fee_percent NUMERIC DEFAULT 5.0,
  PRIMARY KEY (id)
);

CREATE TABLE stripe_events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  stripe_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  account_id TEXT,
  processed BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
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
  platform_fee_amount INTEGER DEFAULT 0,
  platform_fee_percent NUMERIC DEFAULT 5.0,
  stripe_application_fee_id TEXT,
  PRIMARY KEY (id)
);

ALTER TABLE application_fees ADD CONSTRAINT fk_application_fees_subscription_id FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);
ALTER TABLE application_fees ADD CONSTRAINT fk_application_fees_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_subscription_id FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_subscription_id FOREIGN KEY (subscription_id) REFERENCES subscriptions(id);
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_developer_id FOREIGN KEY (developer_id) REFERENCES developers(id);
ALTER TABLE commissions ADD CONSTRAINT fk_commissions_application_fee_id FOREIGN KEY (application_fee_id) REFERENCES application_fees(id);
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
