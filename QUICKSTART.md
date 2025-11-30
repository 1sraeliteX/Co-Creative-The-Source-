# Source HUB - Quick Start Guide

Get the Source HUB MVP up and running in 5 minutes!

## Step 1: Setup Database

### Option A: Using Neon (Recommended)

1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)

### Option B: Using Local PostgreSQL

```bash
# Start PostgreSQL with Docker
docker-compose up -d
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure Environment

```bash
# Copy environment template
cp packages/backend/.env.example packages/backend/.env

# Edit the file and add your database connection
# For Neon: DATABASE_URL=postgresql://...
# For local: Use the default DB_HOST, DB_PORT, etc.
```

## Step 4: Run Migrations

```bash
npm run migrate --workspace=backend
```

You should see:
```
✓ Migration 001 completed
✓ Migration 002 completed
...
✓ Migration 008 completed
All migrations completed successfully!
```

## Step 5: Start the Server

```bash
npm run dev:backend
```

You should see:
```
✓ Redis connected (or skip if not using Redis)
✓ Database connected
✓ Source HUB API server running on port 3000
```

## Step 6: Test the API

### Quick Test

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### Run Full Test Suite

```bash
# Make the test script executable
chmod +x test-api.sh

# Run tests
./test-api.sh
```

This will:
- ✅ Register a test member
- ✅ Create a workspace
- ✅ Make a booking
- ✅ Process payment
- ✅ Verify access control
- ✅ Test infrastructure monitoring

## What's Available

### API Endpoints (50+)

**Members** (`/api/members`)
- Register, update profile, upgrade tier, apply scholarship

**Workspaces** (`/api/workspaces`)
- Create, list, check availability

**Bookings** (`/api/bookings`)
- Create, cancel, check-in, trial bookings

**Payments** (`/api/payments`)
- Process payments, refunds, generate invoices

**Access Control** (`/api/access`)
- Verify access, log entry/exit, track occupancy

**Infrastructure** (`/api/infrastructure`)
- Monitor power/internet, calculate uptime, alerts

### Features Implemented

✅ Member registration with 4 tiers (Trial, Basic, Pro, Enterprise)
✅ Workspace booking with conflict detection
✅ Payment processing with scholarship discounts (30%)
✅ Access control with multiple auth methods
✅ Infrastructure monitoring with real-time alerts
✅ Complete audit trails for all operations

## Common Issues

### "Cannot connect to database"
- Check your DATABASE_URL in `.env`
- Verify your Neon database is active
- Check your IP is whitelisted in Neon

### "Port 3000 already in use"
- Change PORT in `.env` to 3001 or another port

### "Redis connection failed"
- Redis is optional for now
- Comment out Redis code in `src/index.ts` if not using it

## Next Steps

1. **Explore the API**: See `TESTING.md` for detailed API examples
2. **Add Sample Data**: Use the test script to create members, workspaces, bookings
3. **Continue Development**: Proceed with remaining tasks (workshops, mentorship, frontend)

## Project Structure

```
source-hub/
├── packages/
│   ├── backend/          # Node.js/TypeScript API
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── services/ # Business logic
│   │   │   ├── repositories/ # Data access
│   │   │   ├── db/       # Migrations & queries
│   │   │   └── types/    # TypeScript types
│   │   └── package.json
│   └── frontend/         # Next.js app (basic setup)
├── TESTING.md           # Detailed testing guide
├── QUICKSTART.md        # This file
└── test-api.sh          # Automated test script
```

## Support

For issues or questions:
1. Check `TESTING.md` for detailed examples
2. Review the code in `packages/backend/src/`
3. Check database logs in Neon dashboard

Happy coding! 🚀
