-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_developers_stripe_account_id ON developers(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_developers_user_id ON developers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_email ON subscriptions(customer_email);
CREATE INDEX IF NOT EXISTS idx_customer_attributions_developer_id ON customer_attributions(developer_id);
CREATE INDEX IF NOT EXISTS idx_customer_attributions_subscription_id ON customer_attributions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payouts_developer_id ON payouts(developer_id);
CREATE INDEX IF NOT EXISTS idx_payouts_stripe_transfer_id ON payouts(stripe_transfer_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_developers_updated_at 
  BEFORE UPDATE ON developers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at 
  BEFORE UPDATE ON payouts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
