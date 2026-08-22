# SunCart

SunCart is a responsive summer-essentials storefront built with Next.js App Router. Visitors can browse the catalog, search by product or brand, filter by category, and view product details. Account holders can sign in with email/password or Google OAuth when Google credentials are configured, view their profile, and update their display name and photo URL.

## Features

SunCart includes a responsive storefront, an auto-playing hero carousel, product search and category filters, protected product-detail and account routes, Better Auth session management backed by MongoDB, optional Google OAuth, resilient account avatars, legal pages, accessible navigation controls, production error recovery, and security headers.

The cart control is intentionally disabled because this assignment does not implement order creation, payment processing, inventory mutation, or checkout. It is not presented as a functional payment flow.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, Tailwind CSS v4, HeroUI |
| Authentication | Better Auth |
| Database | MongoDB |
| Media and interaction | `next/image`, Embla Carousel, Framer Motion, React Icons |
| Quality checks | ESLint and the production Next.js build |

## Requirements

Use Node.js 20.9 or newer and npm. A MongoDB database is required for account features. Google OAuth is optional; email/password authentication remains available without it.

## Local setup

```bash
git clone https://github.com/khalidhasan-m/suncart.git
cd suncart
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) after the development server starts.

## Environment variables

Copy `.env.example` to `.env.local` and replace every required placeholder. Never commit `.env.local` or production credentials.

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes for auth | MongoDB connection string |
| `MONGO_DB_NAME` | No | Database name; defaults to `sun-cart` |
| `BETTER_AUTH_SECRET` | Yes for auth | Random secret of at least 32 characters |
| `BETTER_AUTH_URL` | Yes in production | Canonical application URL |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Recommended | Comma-separated trusted origins |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL used for metadata |
| `NEXT_PUBLIC_AUTH_URL` | No | Explicit browser auth URL; same-origin `/api/auth` is the default |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | No | Set to `true` only when Google OAuth is configured |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | No | Public support email |
| `NEXT_PUBLIC_SUPPORT_PHONE` | No | Public support phone |
| `NEXT_PUBLIC_FACEBOOK_URL` | No | Facebook profile URL; unset channels are hidden |
| `NEXT_PUBLIC_INSTAGRAM_URL` | No | Instagram profile URL; unset channels are hidden |
| `NEXT_PUBLIC_X_URL` | No | X profile URL; unset channels are hidden |

For Google OAuth, configure the provider callback URL for your deployed application according to Better Auth’s Google provider setup. Keep the client secret server-side, define both Google variables together, and set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` only after the server credentials are ready.

## Verification and production start

Run the complete release check before deployment:

```bash
npm run verify
```

The command runs ESLint and a production Next.js build. To run the already-built application:

```bash
npm start
```

The auth API is initialized lazily on request, so a build can run in CI without production secrets. Runtime authentication requests still fail fast with a clear configuration error when required variables are missing.

## Production notes

Use a strong randomly generated `BETTER_AUTH_SECRET`, set `BETTER_AUTH_URL` to the exact HTTPS origin, configure the same origin in `BETTER_AUTH_TRUSTED_ORIGINS`, and restrict MongoDB network access to the deployed application. Configure environment variables in the hosting provider rather than committing them. The application sends `nosniff`, frame-denial, strict referrer, and restrictive permissions headers, and it allows optimized remote images only from the hosts used by the catalog.

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Storefront home page |
| `/products` | Public | Searchable product catalog |
| `/products/[id]` | Authenticated | Product details |
| `/login` | Public | Email/password and optional Google sign-in |
| `/register` | Public | Account registration |
| `/profile` | Authenticated | Account details |
| `/profile/update` | Authenticated | Update account name and photo URL |
| `/privacy-policy` | Public | Privacy policy |
| `/terms-of-service` | Public | Terms of service |
