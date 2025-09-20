# 🚀 Deedify Quick Start Guide

Get up and running with the combined Deedify frontend and backend in minutes!

## Prerequisites

- Node.js 18+ 
- pnpm (package manager)
- Docker Desktop (for database)

## Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./scripts/setup.sh

# Start development
./scripts/dev.sh
```

## Option 2: Manual Setup

### 1. Install Dependencies

```bash
# Install all dependencies
pnpm install:all
```

### 2. Set Up Environment

```bash
# Backend environment
cd apps/api
cp .env.example .env
# Edit .env with your configuration

# Frontend environment  
cd ../../frontend
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Start Database

```bash
# Start PostgreSQL and Redis
docker-compose -f docker/docker-compose.yml up -d
```

### 4. Set Up Database

```bash
# Run migrations and seed data
pnpm db:migrate
pnpm db:seed
```

### 5. Start Development

```bash
# Start all services
pnpm dev
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000  
- **API Docs**: http://localhost:4000/docs
- **Valuation Service**: http://localhost:3001

## Quick Commands

```bash
# Start all services
pnpm dev

# Start individual services
pnpm dev:api        # Backend only
pnpm dev:frontend   # Frontend only
pnpm dev:valuation  # Valuation service only

# Database operations
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed database
pnpm db:reset       # Reset database (⚠️ deletes data)

# Build
pnpm build          # Build all
pnpm build:api      # Build backend
pnpm build:frontend # Build frontend
```

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000, 4000, 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9  
lsof -ti:3001 | xargs kill -9
```

### Database Issues
```bash
# Reset database
pnpm db:reset
pnpm db:seed
```

### Dependency Issues
```bash
# Clean install
rm -rf node_modules apps/*/node_modules frontend/node_modules
pnpm install:all
```

## Next Steps

1. **Explore the API**: Visit http://localhost:4000/docs
2. **Test the Frontend**: Register and login at http://localhost:3000
3. **Connect Wallet**: Install Phantom wallet and connect
4. **Browse Listings**: Check out the land listings
5. **Make Purchases**: Try the mock purchase flow

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review the [troubleshooting section](./README.md#-troubleshooting)
- Check the API documentation at http://localhost:4000/docs

Happy coding! 🎉