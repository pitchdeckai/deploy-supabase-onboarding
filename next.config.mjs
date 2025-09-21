/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow all development origins to prevent cross-origin blocking
  experimental: {
    allowedDevOrigins: ['api.forgedai.com', 'localhost:3000', '*.vercel.app', 'js.stripe.com', 'connect.stripe.com', 'dashboard.stripe.com', '*.stripe.com', '*'],
  },
  // Add external script domains for Stripe
  async rewrites() {
    return [
      {
        source: '/stripe-js/:path*',
        destination: 'https://js.stripe.com/:path*',
      },
    ];
  },
  // Configure security headers and CORS
  async headers() {
    return [
      {
        // Apply security headers to all pages
        source: '/:path*',
headers: [
          // Temporarily disabled CSP for debugging
          // {
          //   key: 'Content-Security-Policy',
          //   value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://connect.stripe.com https://q.stripe.com https://hooks.stripe.com; frame-src 'self' https://connect.stripe.com https://js.stripe.com; connect-src 'self' https://api.stripe.com https://connect.stripe.com https://hooks.stripe.com https://api.forgedai.com https://qgpybicovgofmklvsyts.supabase.co wss://qgpybicovgofmklvsyts.supabase.co;",
          // },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        // CORS headers for API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, stripe-signature' },
        ],
      },
    ];
  },
  // Ensure environment variables are available in the browser
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default nextConfig;