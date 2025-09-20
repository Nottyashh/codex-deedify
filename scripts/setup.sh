#!/bin/bash

# Deedify Setup Script
# This script helps set up the development environment

echo "🔧 Setting up Deedify Development Environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm is installed"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need Docker for the database."
    echo "   Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
else
    echo "✅ Docker is installed"
fi

# Install all dependencies
echo "📦 Installing all dependencies..."
pnpm install

echo "📦 Installing backend dependencies..."
cd apps/api && pnpm install && cd ../..

echo "📦 Installing valuation service dependencies..."
cd apps/valuation && pnpm install && cd ../..

echo "📦 Installing frontend dependencies..."
cd frontend && pnpm install && cd ..

# Set up environment files
echo "🔧 Setting up environment files..."

if [ ! -f "apps/api/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp apps/api/.env.example apps/api/.env
    echo "✅ Backend .env file created. Please edit it with your configuration."
else
    echo "✅ Backend .env file already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend .env.local file..."
    cp frontend/.env.example frontend/.env.local
    echo "✅ Frontend .env.local file created. Please edit it with your configuration."
else
    echo "✅ Frontend .env.local file already exists"
fi

# Start Docker services if available
if command -v docker &> /dev/null && docker info &> /dev/null; then
    echo "🐳 Starting Docker services..."
    docker-compose -f docker/docker-compose.yml up -d
    echo "✅ Docker services started"
else
    echo "⚠️  Docker not available. Please start Docker and run:"
    echo "   docker-compose -f docker/docker-compose.yml up -d"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd apps/api && pnpm prisma generate && cd ../..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit apps/api/.env with your database and API keys"
echo "2. Edit frontend/.env.local with your configuration"
echo "3. Run database migrations: pnpm db:migrate"
echo "4. Seed the database: pnpm db:seed"
echo "5. Start development: pnpm dev"
echo ""
echo "Or run the development script: ./scripts/dev.sh"