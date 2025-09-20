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
  // Configure external domains for scripts
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://connect.stripe.com;",
          },
        ],
      },
    ];
  },
  // Add CORS headers for API routes
  async headers() {
    return [
      {
        // Apply to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Allow all origins for dev; change to 'https://api.forgeai.com' if needed
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
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