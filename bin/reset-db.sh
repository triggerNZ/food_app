#!/bin/bash

# Database configuration
DB_NAME="food_app"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Resetting database...${NC}"

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running. Please start the database first with:${NC}"
    echo -e "${YELLOW}   docker-compose up -d${NC}"
    exit 1
fi

# Drop database if it exists
echo -e "${YELLOW}📦 Dropping database if it exists...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null

# Create database
echo -e "${YELLOW}📦 Creating database...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

# Apply schema
echo -e "${YELLOW}📋 Applying schema...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f db/schema.sql

# Seed data
echo -e "${YELLOW}🌱 Seeding data...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f db/seed.sql

echo -e "${GREEN}✅ Database reset complete!${NC}"
echo -e "${GREEN}📊 Database '$DB_NAME' is ready with fresh schema and seed data.${NC}"
