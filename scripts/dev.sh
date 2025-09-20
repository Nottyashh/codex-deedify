#!/bin/bash

# Deedify Development Script
# This script starts both the backend API and frontend together

echo "🚀 Starting Deedify Development Environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Check if Docker is running (for database)
if ! docker info &> /dev/null; then
    echo "⚠️  Docker is not running. Please start Docker for database services."
    echo "   You can start the database later with: docker-compose -f docker/docker-compose.yml up -d"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    pnpm install
fi

if [ ! -d "apps/api/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd apps/api && pnpm install && cd ../..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && pnpm install && cd ..
fi

if [ ! -d "apps/valuation/node_modules" ]; then
    echo "📦 Installing valuation service dependencies..."
    cd apps/valuation && pnpm install && cd ../..
fi

# Check if .env files exist
if [ ! -f "apps/api/.env" ]; then
    echo "⚠️  Backend .env file not found. Please copy .env.example to .env and configure it."
    echo "   Run: cd apps/api && cp .env.example .env"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Frontend .env.local file not found. Please copy .env.example to .env.local and configure it."
    echo "   Run: cd frontend && cp .env.example .env.local"
fi

echo "🎯 Starting all services with Turbo..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Backend API will be available at: http://localhost:4000"
echo "   API Documentation will be available at: http://localhost:4000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Start all services with Turbo
pnpm dev