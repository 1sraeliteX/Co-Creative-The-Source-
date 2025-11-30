# Source HUB - Testing Guide

This guide will help you test the MVP features that have been implemented.

## Prerequisites

1. **Neon Database**: Create a database at https://neon.tech and get your connection string
2. **Node.js 18+**: Ensure you have Node.js installed
3. **Environment Setup**: Configure your environment variables

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` file in `packages/backend/`:

```bash
cp packages/backend/.env.example packages/backend/.env
```

Edit `packages/backend/.env` and add your Neon connection string:

```env
# Use your Neon connection string
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Or use local PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=source_hub
# DB_USER=postgres
# DB_PASSWORD=postgres

# Redis (optional for now)
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3000
NODE_ENV=development
```

### 3. Run Database Migrations

```bash
npm run migrate --workspace=backend
```

### 4. Start the Backend Server

```bash
npm run dev:backend
```

The server should start on `http://localhost:3000`

## Testing the API

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "redis": "connected"
}
```

### Test Scenarios

#### 1. Member Registration & Management

**Register a new member:**
```bash
curl -X POST http://localhost:3000/api/members/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "password": "securepassword",
    "membershipTier": "basic",
    "skills": ["JavaScript", "React"],
    "interests": ["Web Development", "AI"]
  }'
```

**Get member by ID:**
```bash
curl http://localhost:3000/api/members/{member-id}
```

**Apply scholarship:**
```bash
curl -X POST http://localhost:3000/api/members/{member-id}/scholarship
```

#### 2. Workspace Management

**Create a workspace:**
```bash
curl -X POST http://localhost:3000/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hot Desk 1",
    "type": "desk",
    "capacity": 1,
    "hourlyRate": 5,
    "dailyRate": 30,
    "monthlyRate": 500,
    "amenities": ["WiFi", "Power Outlet"],
    "equipment": ["Monitor", "Keyboard"],
    "floor": 1
  }'
```

**List all workspaces:**
```bash
curl http://localhost:3000/api/workspaces
```

**Get available workspaces:**
```bash
curl http://localhost:3000/api/workspaces?available=true
```

#### 3. Booking System

**Check availability:**
```bash
curl -X POST http://localhost:3000/api/bookings/check-availability \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "{workspace-id}",
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-15T17:00:00Z"
  }'
```

**Create a booking:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "{member-id}",
    "workspaceId": "{workspace-id}",
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-15T17:00:00Z",
    "bookingType": "daily"
  }'
```

**Create trial booking (first-time users):**
```bash
curl -X POST http://localhost:3000/api/bookings/trial \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "{member-id}",
    "workspaceId": "{workspace-id}",
    "startTime": "2024-01-15T09:00:00Z"
  }'
```

**Cancel booking:**
```bash
curl -X POST http://localhost:3000/api/bookings/{booking-id}/cancel
```

#### 4. Payment Processing

**Process booking payment:**
```bash
curl -X POST http://localhost:3000/api/payments/booking \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "{booking-id}",
    "paymentMethod": "card",
    "currency": "USD"
  }'
```

**Get payment details:**
```bash
curl http://localhost:3000/api/payments/{payment-id}
```

**Generate invoice:**
```bash
curl http://localhost:3000/api/payments/{payment-id}/invoice
```

**Get revenue by type:**
```bash
curl "http://localhost:3000/api/payments/revenue/by-type?startDate=2024-01-01&endDate=2024-12-31"
```

#### 5. Access Control

**Verify access (ID card):**
```bash
curl -X POST http://localhost:3000/api/access/verify \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "{access-card-id}",
    "accessMethod": "id-card"
  }'
```

**Verify access to workspace:**
```bash
curl -X POST http://localhost:3000/api/access/verify \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "{member-id}",
    "accessMethod": "mobile-app",
    "workspaceId": "{workspace-id}"
  }'
```

**Get current occupants:**
```bash
curl http://localhost:3000/api/access/occupants
```

**Get access history:**
```bash
curl http://localhost:3000/api/access/history/member/{member-id}
```

#### 6. Infrastructure Monitoring

**Get current status:**
```bash
curl http://localhost:3000/api/infrastructure/status
```

**Record metric (simulating IoT sensor):**
```bash
curl -X POST http://localhost:3000/api/infrastructure/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "metricType": "power",
    "powerSource": "grid",
    "powerStatus": "online"
  }'
```

**Get power uptime:**
```bash
curl "http://localhost:3000/api/infrastructure/uptime/power?startDate=2024-01-01&endDate=2024-01-31"
```

**Get internet speed compliance:**
```bash
curl http://localhost:3000/api/infrastructure/compliance/internet-speed
```

## Complete Test Flow

Here's a complete end-to-end test scenario:

```bash
# 1. Register a member
MEMBER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/members/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "+1234567890",
    "password": "password123",
    "membershipTier": "basic",
    "skills": ["JavaScript"],
    "interests": ["Coding"]
  }')

MEMBER_ID=$(echo $MEMBER_RESPONSE | jq -r '.member.id')
echo "Member ID: $MEMBER_ID"

# 2. Create a workspace
WORKSPACE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Desk",
    "type": "desk",
    "capacity": 1,
    "hourlyRate": 5,
    "dailyRate": 30,
    "monthlyRate": 500,
    "floor": 1
  }')

WORKSPACE_ID=$(echo $WORKSPACE_RESPONSE | jq -r '.workspace.id')
echo "Workspace ID: $WORKSPACE_ID"

# 3. Create a booking
BOOKING_RESPONSE=$(curl -s -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d "{
    \"memberId\": \"$MEMBER_ID\",
    \"workspaceId\": \"$WORKSPACE_ID\",
    \"startTime\": \"2024-01-15T09:00:00Z\",
    \"endTime\": \"2024-01-15T17:00:00Z\",
    \"bookingType\": \"daily\"
  }")

BOOKING_ID=$(echo $BOOKING_RESPONSE | jq -r '.booking.id')
echo "Booking ID: $BOOKING_ID"

# 4. Process payment
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/payments/booking \
  -H "Content-Type: application/json" \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"paymentMethod\": \"card\",
    \"currency\": \"USD\"
  }")

echo "Payment processed: $PAYMENT_RESPONSE"

# 5. Verify access
ACCESS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/access/verify \
  -H "Content-Type: application/json" \
  -d "{
    \"identifier\": \"$MEMBER_ID\",
    \"accessMethod\": \"mobile-app\",
    \"workspaceId\": \"$WORKSPACE_ID\"
  }")

echo "Access verification: $ACCESS_RESPONSE"
```

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Verify your Neon connection string is correct
2. Check that SSL is enabled in the connection string
3. Ensure your IP is whitelisted in Neon dashboard

### Redis Connection Issues

If Redis is not available:
1. Comment out Redis-related code in `src/index.ts` temporarily
2. Or install Redis locally: `brew install redis` (Mac) or use Docker

### Port Already in Use

If port 3000 is already in use:
```bash
# Change PORT in .env file
PORT=3001
```

## Next Steps

After testing the API:
1. Review the API responses
2. Check the database to see created records
3. Test error scenarios (invalid data, expired memberships, etc.)
4. Proceed with remaining tasks (workshops, mentorship, frontend, etc.)

## API Documentation

For complete API documentation, see the route files in `packages/backend/src/routes/`:
- `infrastructure.ts` - Infrastructure monitoring
- `bookings.ts` - Booking management
- `workspaces.ts` - Workspace management
- `payments.ts` - Payment processing
- `members.ts` - Member management
- `access.ts` - Access control
