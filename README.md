# Deedify - Tokenized Land Ownership Platform (Combined)

A full-stack application for fractional ownership of raw land through blockchain technology, built with Next.js frontend and NestJS backend in a unified monorepo.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose (optional)
- Phantom Wallet browser extension

### 1. Environment Setup

#### Backend (.env)
```bash
cd apps/api
cp .env.example .env
```

Edit `.env` with your values:
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deedify

# Solana
HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=11d1056e-2fdc-43bc-a985-c649236d3af1
ANCHOR_PROVIDER_URL=https://devnet.helius-rpc.com/?api-key=11d1056e-2fdc-43bc-a985-c649236d3af1

# App
JWT_SECRET=your_jwt_secret_change_me
PORT=4000
USE_MOCK_ESCROW=true
```

#### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_SOLANA_RPC=https://devnet.helius-rpc.com/?api-key=11d1056e-2fdc-43bc-a985-c649236d3af1
```

### 2. Database Setup

#### Option A: Docker (Recommended)
```bash
# Start PostgreSQL and Redis
docker-compose -f docker/docker-compose.yml up -d
```

#### Option B: Local PostgreSQL
Install PostgreSQL locally and update DATABASE_URL in `.env`

### 3. Install Dependencies & Start

#### Option 1: Install All at Once
```bash
# Install all dependencies (from root)
pnpm install:all
```

#### Option 2: Install Separately
```bash
# Install root dependencies
pnpm install

# Install backend dependencies
cd apps/api
pnpm install

# Install valuation service dependencies
cd ../valuation
pnpm install

# Install frontend dependencies
cd ../../frontend
pnpm install
```

### 4. Database Setup

```bash
# Backend setup
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
```

### 5. Start the Application

#### Start All Services (Recommended)
```bash
# Start all services with Turbo
pnpm dev
```

#### Start Services Individually
```bash
# Start backend (from root)
pnpm dev:api

# Start frontend (from root)
pnpm dev:frontend

# Start valuation service (from root)
pnpm dev:valuation
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/docs
- **Valuation Service**: http://localhost:3001

## 📁 Project Structure

```
deedify-combined/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # API client & utilities
│   └── types/               # TypeScript types
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/       # Authentication
│   │   │   ├── listings/   # Land listings
│   │   │   ├── orders/     # Purchase orders
│   │   │   ├── holdings/   # User holdings
│   │   │   ├── marketplace/# Trading
│   │   │   └── ...
│   │   └── prisma/         # Database schema & migrations
│   └── valuation/          # Valuation microservice
├── docker/                 # Docker configuration
├── scripts/                # Utility scripts
└── docs/                   # Documentation
```

## 🔧 Available Scripts

### Development
- `pnpm dev` - Start all services with Turbo
- `pnpm dev:api` - Start only the backend API
- `pnpm dev:frontend` - Start only the frontend
- `pnpm dev:valuation` - Start only the valuation service

### Building
- `pnpm build` - Build all services
- `pnpm build:api` - Build only the backend API
- `pnpm build:frontend` - Build only the frontend

### Database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:reset` - Reset database (WARNING: deletes all data)

### Blockchain Operations
- `pnpm mint:collection` - Mint collection NFT
- `pnpm mint:fractions` - Mint fractional NFTs
- `pnpm onchain:sync` - Sync on-chain holders
- `pnpm verify:auction` - Verify auction house setup
- `pnpm valuation:backfill` - Backfill valuations

### Utilities
- `pnpm install:all` - Install dependencies for all services
- `pnpm test` - Run tests
- `pnpm lint` - Run linting

## 🧪 Testing the Integration

### 1. Register & Login
1. Go to http://localhost:3000
2. Click "Register" and create an account
3. Login with your credentials

### 2. Connect Phantom Wallet
1. Install Phantom wallet extension
2. Create/import a wallet
3. Click "Connect Wallet" in the app
4. Approve the connection

### 3. Browse & Purchase Land
1. Go to "Listings" page
2. Click on any property to view details
3. Enter number of shares to purchase
4. Click "Purchase Shares"
5. Complete the mock transaction

### 4. View Holdings
1. Go to "My Holdings" page
2. See your purchased land shares
3. Track your investment performance

## 🎯 Key Features

### ✅ Implemented
- User authentication (register/login)
- Phantom wallet integration
- Land listing browsing
- Fractional share purchasing (mock)
- Holdings tracking
- Responsive UI with Tailwind CSS
- Unified monorepo with Turbo

### 🚧 Mock Implementation
- Solana transaction processing (USE_MOCK_ESCROW=true)
- Payment processing
- NFT minting

### 📋 TODO
- Real Solana/Anchor integration
- NFT collection & fractional minting
- Governance voting system
- Revenue distribution
- KYC verification
- Property valuation AI

## 🔐 Security Notes

- JWT tokens for API authentication
- CORS enabled for localhost:3000
- Input validation with Zod schemas
- SQL injection prevention with Prisma
- Wallet signature verification (TODO)

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Reset database
cd apps/api
pnpm prisma migrate reset --force
pnpm prisma db seed
```

### Frontend Build Issues
```bash
cd frontend
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Backend Build Issues
```bash
cd apps/api
rm -rf dist node_modules
pnpm install
pnpm build
```

### Wallet Connection Issues
- Ensure Phantom wallet is installed
- Check browser console for errors
- Try refreshing the page

## 📚 Development

### Adding New Features
1. Backend: Add controller, service, repository
2. Frontend: Add pages, components, API calls
3. Update types and validation schemas
4. Test the integration

### Database Changes
```bash
cd apps/api
pnpm prisma migrate dev --name your_migration_name
pnpm prisma generate
```

## 🚀 Deployment

### Production Environment Variables
```bash
# Backend
NODE_ENV=production
DATABASE_URL=your_production_db_url
JWT_SECRET=your_secure_jwt_secret
USE_MOCK_ESCROW=false

# Frontend
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### Docker Deployment
```bash
# Build and run with docker-compose
docker-compose -f docker/docker-compose.prod.yml up -d
```

## 📄 API Documentation

- **Swagger UI**: http://localhost:4000/docs
- **Postman Collection**: Available in `/docs/postman-collection.json`
- **OpenAPI Spec**: Available at `/docs/openapi.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Create an issue on GitHub

---

**Happy coding! 🎉**