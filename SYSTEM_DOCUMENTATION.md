# Stripe Connect SaaS Platform - System Documentation

## Overview
This is a comprehensive Stripe Connect integration for SaaS platforms that allows developers to onboard, create subscription products, manage customers, and receive payouts.

## System Architecture

\`\`\`mermaid
graph TB
    A[User Registration] --> B[Supabase Auth]
    B --> C[Developer Dashboard]
    C --> D[Stripe Connect Onboarding]
    D --> E[Embedded Account Setup]
    E --> F[Product Management]
    F --> G[Subscription Creation]
    G --> H[Customer Management]
    H --> I[Payout Processing]
    
    subgraph "Database Layer"
        J[developers table]
        K[products table]
        L[customers table]
        M[subscriptions table]
        N[payouts table]
    end
    
    subgraph "Stripe Integration"
        O[Connected Accounts]
        P[Products & Prices]
        Q[Subscriptions]
        R[Webhooks]
        S[Payouts]
    end
    
    C --> J
    F --> K
    F --> P
    H --> L
    G --> M
    G --> Q
    R --> M
    R --> L
    I --> N
    I --> S
\`\`\`

## User Onboarding Workflow

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant A as Auth System
    participant D as Dashboard
    participant S as Stripe Connect
    participant DB as Database
    
    U->>A: Sign Up/Login
    A->>DB: Create user record
    A->>D: Redirect to dashboard
    D->>U: Show onboarding status
    U->>D: Click "Complete Setup"
    D->>S: Create account session
    S->>U: Show embedded onboarding
    U->>S: Complete KYC & bank details
    S->>DB: Update developer status via webhook
    DB->>D: Refresh dashboard
    D->>U: Show completed onboarding
\`\`\`

## Product Management Workflow

\`\`\`mermaid
flowchart TD
    A[Developer Dashboard] --> B[Products Page]
    B --> C[Create New Product]
    C --> D[Fill Product Form]
    D --> E{Validation}
    E -->|Valid| F[API: Create Product]
    E -->|Invalid| D
    F --> G[Create Stripe Product]
    G --> H[Create Stripe Price]
    H --> I[Save to Database]
    I --> J[Update UI]
    J --> K[Product Listed]
    
    B --> L[View Existing Products]
    L --> M[Edit Product]
    L --> N[Delete Product]
    M --> O[Update Stripe & DB]
    N --> P[Archive in Stripe & DB]
\`\`\`

## Subscription Management Workflow

\`\`\`mermaid
sequenceDiagram
    participant C as Customer
    participant P as Product Page
    participant API as Checkout API
    participant S as Stripe
    participant W as Webhook
    participant DB as Database
    participant D as Developer Dashboard
    
    C->>P: Select subscription plan
    P->>API: Create checkout session
    API->>S: Create checkout with Connect account
    S->>C: Redirect to checkout
    C->>S: Complete payment
    S->>W: Send subscription.created webhook
    W->>DB: Create customer & subscription records
    W->>D: Update dashboard data
    D->>Developer: Show new subscription
\`\`\`

## Customer Management Workflow

\`\`\`mermaid
graph LR
    A[Customer Dashboard] --> B[View All Customers]
    B --> C[Customer Details]
    C --> D[Subscription History]
    C --> E[Payment History]
    C --> F[Customer Analytics]
    
    B --> G[Search Customers]
    B --> H[Filter by Status]
    B --> I[Export Customer Data]
    
    C --> J[Manage Subscription]
    J --> K[Cancel Subscription]
    J --> L[Update Subscription]
    J --> M[Refund Payment]
\`\`\`

## Database Schema Relationships

\`\`\`mermaid
erDiagram
    users ||--|| developers : "has one"
    developers ||--o{ products : "creates many"
    developers ||--o{ customers : "has many"
    developers ||--o{ payouts : "receives many"
    
    products ||--o{ subscriptions : "has many"
    customers ||--o{ subscriptions : "has many"
    
    users {
        uuid id PK
        string email
        timestamp created_at
    }
    
    developers {
        uuid id PK
        uuid user_id FK
        string stripe_account_id
        string email
        string name
        string status
        jsonb requirements
        timestamp created_at
    }
    
    products {
        uuid id PK
        uuid developer_id FK
        string stripe_product_id
        string stripe_price_id
        string name
        text description
        integer price
        string currency
        string interval
        boolean active
        timestamp created_at
    }
    
    customers {
        uuid id PK
        uuid developer_id FK
        string stripe_customer_id
        string email
        string name
        timestamp created_at
    }
    
    subscriptions {
        uuid id PK
        uuid customer_id FK
        uuid product_id FK
        string stripe_subscription_id
        string status
        integer amount
        string currency
        timestamp current_period_start
        timestamp current_period_end
        timestamp created_at
    }
    
    payouts {
        uuid id PK
        uuid developer_id FK
        string stripe_payout_id
        integer amount
        string currency
        string status
        timestamp created_at
    }
\`\`\`

## API Endpoints Flow

\`\`\`mermaid
graph TD
    subgraph "Authentication APIs"
        A1[POST /api/auth/login]
        A2[POST /api/auth/signup]
        A3[POST /api/auth/logout]
    end
    
    subgraph "Developer APIs"
        B1[POST /api/developer/create-account-session]
        B2[GET /api/developer/status]
        B3[POST /api/stripe/express-dashboard]
    end
    
    subgraph "Product APIs"
        C1[POST /api/products/create]
        C2[GET /api/products/list]
        C3[PUT /api/products/update]
        C4[DELETE /api/products/delete]
    end
    
    subgraph "Subscription APIs"
        D1[POST /api/subscriptions/create-checkout]
        D2[GET /api/subscriptions/list]
        D3[POST /api/subscriptions/cancel]
        D4[GET /api/subscriptions/analytics]
    end
    
    subgraph "Webhook APIs"
        E1[POST /api/webhooks/stripe-connect]
        E2[POST /api/webhooks/stripe]
    end
    
    A1 --> B1
    B1 --> C1
    C1 --> D1
    D1 --> E1
\`\`\`

## Payment & Payout Flow

\`\`\`mermaid
sequenceDiagram
    participant C as Customer
    participant P as Platform
    participant S as Stripe
    participant CA as Connected Account
    participant D as Developer
    
    C->>P: Subscribe to product
    P->>S: Create checkout session
    Note over S: Destination charge with application fee
    S->>CA: Transfer 70% to connected account
    S->>P: Keep 30% as platform fee
    S->>P: Send webhook events
    P->>D: Update earnings dashboard
    
    Note over CA: Automatic payouts enabled
    CA->>D: Receive payout to bank account
\`\`\`

## Page Navigation Flow

\`\`\`mermaid
graph TD
    A[/ - Landing Page] --> B[/auth/login - Login]
    A --> C[/auth/sign-up - Sign Up]
    B --> D[/developer/dashboard - Main Dashboard]
    C --> E[/auth/sign-up-success - Email Verification]
    E --> B
    
    D --> F[/developer/onboard - Stripe Onboarding]
    D --> G[/developer/products - Product Management]
    D --> H[/developer/subscriptions - Subscription Management]
    D --> I[/developer/customers - Customer Management]
    D --> J[/developer/settings - Account Settings]
    
    F --> D
    G --> K[Create/Edit Products]
    H --> L[View Subscription Analytics]
    I --> M[Customer Details & Management]
\`\`\`

## Webhook Event Handling

\`\`\`mermaid
flowchart TD
    A[Stripe Webhook] --> B{Event Type}
    
    B -->|account.updated| C[Update Developer Status]
    B -->|customer.subscription.created| D[Create Subscription Record]
    B -->|customer.subscription.updated| E[Update Subscription Status]
    B -->|customer.subscription.deleted| F[Cancel Subscription]
    B -->|invoice.payment_succeeded| G[Record Payment]
    B -->|invoice.payment_failed| H[Handle Failed Payment]
    B -->|payout.created| I[Record Payout]
    
    C --> J[Update Database]
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> K[Trigger UI Updates]
\`\`\`

## Data Flow Summary

### Input Data:
- **User Registration**: Email, password, name
- **Developer Onboarding**: Business details, bank information, identity verification
- **Product Creation**: Name, description, price, billing interval, currency
- **Customer Data**: Email, payment information, subscription preferences
- **Webhook Events**: Stripe event data for real-time updates

### Output Data:
- **Dashboard Analytics**: Revenue metrics, subscription counts, customer insights
- **Financial Reports**: Earnings summaries, payout history, transaction details
- **Customer Insights**: Subscription status, payment history, customer lifetime value
- **Account Status**: Onboarding progress, verification requirements, payout eligibility

### Key Features:
1. **Embedded Onboarding**: Users never leave your platform during Stripe Connect setup
2. **Real-time Sync**: Webhooks keep database in sync with Stripe
3. **Comprehensive Analytics**: Detailed insights into business performance
4. **Automated Payouts**: Direct transfers to developer bank accounts
5. **Customer Management**: Full customer lifecycle management
6. **Subscription Flexibility**: Support for multiple billing intervals and currencies
