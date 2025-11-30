#!/bin/bash

# Source HUB API Test Script
# This script tests the main API endpoints

API_URL="http://localhost:3000"

echo "🧪 Testing Source HUB API..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test health endpoint
echo -e "\n${YELLOW}1. Testing Health Endpoint${NC}"
HEALTH=$(curl -s $API_URL/health)
if echo $HEALTH | grep -q "ok"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo $HEALTH | jq '.'
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi

# Register a member
echo -e "\n${YELLOW}2. Registering a Test Member${NC}"
MEMBER_RESPONSE=$(curl -s -X POST $API_URL/api/members/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "name": "Test User",
    "phone": "+1234567890",
    "password": "password123",
    "membershipTier": "basic",
    "skills": ["JavaScript", "TypeScript"],
    "interests": ["Web Development", "Cloud Computing"]
  }')

if echo $MEMBER_RESPONSE | grep -q "member"; then
    echo -e "${GREEN}✓ Member registered successfully${NC}"
    MEMBER_ID=$(echo $MEMBER_RESPONSE | jq -r '.member.id')
    ACCESS_CARD_ID=$(echo $MEMBER_RESPONSE | jq -r '.member.accessCardId')
    echo "Member ID: $MEMBER_ID"
    echo "Access Card ID: $ACCESS_CARD_ID"
else
    echo -e "${RED}✗ Member registration failed${NC}"
    echo $MEMBER_RESPONSE
    exit 1
fi

# Apply scholarship
echo -e "\n${YELLOW}3. Applying Scholarship${NC}"
SCHOLARSHIP_RESPONSE=$(curl -s -X POST $API_URL/api/members/$MEMBER_ID/scholarship)
if echo $SCHOLARSHIP_RESPONSE | grep -q "scholarshipStatus"; then
    echo -e "${GREEN}✓ Scholarship applied${NC}"
else
    echo -e "${RED}✗ Scholarship application failed${NC}"
fi

# Create a workspace
echo -e "\n${YELLOW}4. Creating a Workspace${NC}"
WORKSPACE_RESPONSE=$(curl -s -X POST $API_URL/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hot Desk",
    "type": "desk",
    "capacity": 1,
    "hourlyRate": 5,
    "dailyRate": 30,
    "monthlyRate": 500,
    "amenities": ["WiFi", "Power Outlet", "Monitor"],
    "equipment": ["Desk", "Chair"],
    "floor": 1
  }')

if echo $WORKSPACE_RESPONSE | grep -q "workspace"; then
    echo -e "${GREEN}✓ Workspace created${NC}"
    WORKSPACE_ID=$(echo $WORKSPACE_RESPONSE | jq -r '.workspace.id')
    echo "Workspace ID: $WORKSPACE_ID"
else
    echo -e "${RED}✗ Workspace creation failed${NC}"
    echo $WORKSPACE_RESPONSE
    exit 1
fi

# Check availability
echo -e "\n${YELLOW}5. Checking Workspace Availability${NC}"
TOMORROW=$(date -u -d "+1 day" +"%Y-%m-%dT09:00:00Z" 2>/dev/null || date -u -v+1d +"%Y-%m-%dT09:00:00Z")
END_TIME=$(date -u -d "+1 day" +"%Y-%m-%dT17:00:00Z" 2>/dev/null || date -u -v+1d +"%Y-%m-%dT17:00:00Z")

AVAILABILITY=$(curl -s -X POST $API_URL/api/bookings/check-availability \
  -H "Content-Type: application/json" \
  -d "{
    \"workspaceId\": \"$WORKSPACE_ID\",
    \"startTime\": \"$TOMORROW\",
    \"endTime\": \"$END_TIME\"
  }")

if echo $AVAILABILITY | grep -q "available"; then
    echo -e "${GREEN}✓ Availability check completed${NC}"
    echo $AVAILABILITY | jq '.'
else
    echo -e "${RED}✗ Availability check failed${NC}"
fi

# Create a booking
echo -e "\n${YELLOW}6. Creating a Booking${NC}"
BOOKING_RESPONSE=$(curl -s -X POST $API_URL/api/bookings \
  -H "Content-Type: application/json" \
  -d "{
    \"memberId\": \"$MEMBER_ID\",
    \"workspaceId\": \"$WORKSPACE_ID\",
    \"startTime\": \"$TOMORROW\",
    \"endTime\": \"$END_TIME\",
    \"bookingType\": \"daily\"
  }")

if echo $BOOKING_RESPONSE | grep -q "booking"; then
    echo -e "${GREEN}✓ Booking created${NC}"
    BOOKING_ID=$(echo $BOOKING_RESPONSE | jq -r '.booking.id')
    BOOKING_AMOUNT=$(echo $BOOKING_RESPONSE | jq -r '.booking.totalAmount')
    echo "Booking ID: $BOOKING_ID"
    echo "Amount: \$$BOOKING_AMOUNT (with 30% scholarship discount)"
else
    echo -e "${RED}✗ Booking creation failed${NC}"
    echo $BOOKING_RESPONSE
    exit 1
fi

# Process payment
echo -e "\n${YELLOW}7. Processing Payment${NC}"
PAYMENT_RESPONSE=$(curl -s -X POST $API_URL/api/payments/booking \
  -H "Content-Type: application/json" \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"paymentMethod\": \"card\",
    \"currency\": \"USD\"
  }")

if echo $PAYMENT_RESPONSE | grep -q "payment"; then
    echo -e "${GREEN}✓ Payment processed${NC}"
    PAYMENT_ID=$(echo $PAYMENT_RESPONSE | jq -r '.payment.id')
    echo "Payment ID: $PAYMENT_ID"
else
    echo -e "${RED}✗ Payment processing failed${NC}"
    echo $PAYMENT_RESPONSE
fi

# Verify access with ID card
echo -e "\n${YELLOW}8. Verifying Access (ID Card)${NC}"
ACCESS_RESPONSE=$(curl -s -X POST $API_URL/api/access/verify \
  -H "Content-Type: application/json" \
  -d "{
    \"identifier\": \"$ACCESS_CARD_ID\",
    \"accessMethod\": \"id-card\"
  }")

if echo $ACCESS_RESPONSE | grep -q "granted"; then
    ACCESS_GRANTED=$(echo $ACCESS_RESPONSE | jq -r '.granted')
    if [ "$ACCESS_GRANTED" = "true" ]; then
        echo -e "${GREEN}✓ Access granted${NC}"
    else
        echo -e "${YELLOW}⚠ Access denied: $(echo $ACCESS_RESPONSE | jq -r '.reason')${NC}"
    fi
else
    echo -e "${RED}✗ Access verification failed${NC}"
fi

# Record infrastructure metric
echo -e "\n${YELLOW}9. Recording Infrastructure Metric${NC}"
METRIC_RESPONSE=$(curl -s -X POST $API_URL/api/infrastructure/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "metricType": "power",
    "powerSource": "grid",
    "powerStatus": "online"
  }')

if echo $METRIC_RESPONSE | grep -q "metric"; then
    echo -e "${GREEN}✓ Metric recorded${NC}"
else
    echo -e "${RED}✗ Metric recording failed${NC}"
fi

# Get infrastructure status
echo -e "\n${YELLOW}10. Getting Infrastructure Status${NC}"
STATUS_RESPONSE=$(curl -s $API_URL/api/infrastructure/status)
if echo $STATUS_RESPONSE | grep -q "status"; then
    echo -e "${GREEN}✓ Status retrieved${NC}"
    echo $STATUS_RESPONSE | jq '.status'
else
    echo -e "${RED}✗ Status retrieval failed${NC}"
fi

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✓ All tests completed!${NC}"
echo -e "\n${YELLOW}Test Summary:${NC}"
echo "Member ID: $MEMBER_ID"
echo "Workspace ID: $WORKSPACE_ID"
echo "Booking ID: $BOOKING_ID"
echo "Payment ID: $PAYMENT_ID"
echo "Access Card: $ACCESS_CARD_ID"
