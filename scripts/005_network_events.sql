-- Network Events Observability Table and Policies
-- Tracks inbound API requests and outbound external calls (e.g., Stripe)

CREATE TABLE IF NOT EXISTS network_events (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Correlation
    request_id TEXT NOT NULL,
    parent_request_id TEXT,

    -- Event classification
    event_kind TEXT NOT NULL, -- 'request' | 'external'
    route TEXT,
    method TEXT,
    status INTEGER,
    duration_ms INTEGER,

    -- Actor / environment
    user_id UUID,
    ip TEXT,
    user_agent TEXT,
    referrer TEXT,

    -- External target info
    target TEXT,       -- e.g. 'stripe', 'fetch'
    operation TEXT,    -- e.g. 'accounts.create'

    -- Additional details
    metadata JSONB,
    error TEXT,

    PRIMARY KEY (id)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_network_events_created_at ON network_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_network_events_request_id ON network_events(request_id);
CREATE INDEX IF NOT EXISTS idx_network_events_event_kind ON network_events(event_kind);
CREATE INDEX IF NOT EXISTS idx_network_events_route ON network_events(route);

-- Enable RLS
ALTER TABLE network_events ENABLE ROW LEVEL SECURITY;

-- Allow inserts from server-side code (anon role) while restricting reads to admins
CREATE POLICY IF NOT EXISTS "Allow inserts from any role" ON network_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Restrict SELECT to platform admins only (same pattern as stripe_events)
CREATE POLICY IF NOT EXISTS "Platform admins can read events" ON network_events
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM developers WHERE email LIKE '%@yourplatform.com'
        )
    );

COMMENT ON TABLE network_events IS 'Structured logs for inbound requests and outbound external network calls';
COMMENT ON COLUMN network_events.request_id IS 'Correlation ID applied per inbound request';
COMMENT ON COLUMN network_events.event_kind IS 'request or external';
COMMENT ON COLUMN network_events.target IS 'External system name (e.g., stripe)';
COMMENT ON COLUMN network_events.operation IS 'External operation name (e.g., accounts.create)';




