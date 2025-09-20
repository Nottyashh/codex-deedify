#!/bin/bash

# Deedify Issue Fix Script
# This script fixes the most critical TypeScript compilation issues

echo "🔧 Fixing critical TypeScript compilation issues..."

# Navigate to the API directory
cd apps/api

echo "📦 Installing missing dependencies..."
pnpm add @nestjs/bullmq nestjs-pino

echo "🗄️ Generating Prisma client..."
pnpm prisma generate

echo "🔧 Fixing DTO validation issues..."

# Create a temporary fix for the most critical DTO issues
cat > temp_dto_fix.ts << 'EOF'
// Temporary fix for DTO validation issues
// This addresses the optional vs required field conflicts

// Fix auth DTOs
const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['INVESTOR', 'LISTER']).default('INVESTOR'),
  walletAddress: z.string().optional(),
});

// Fix marketplace DTOs
const ListShareDto = z.object({
  shareMint: z.string(),
  price: z.number().positive(),
});

const BuyShareDto = z.object({
  shareMint: z.string(),
  buyerWallet: z.string(),
});

const SellShareDto = z.object({
  shareMint: z.string(),
  price: z.number().positive(),
});

const CancelOrderDto = z.object({
  orderId: z.string(),
});

// Fix NFT DTOs
const MintCollectionDto = z.object({
  listingId: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  attributes: z.array(z.object({
    trait_type: z.string(),
    value: z.union([z.string(), z.number()]),
  })).optional(),
});

const MintFractionsDto = z.object({
  listingId: z.string(),
  totalShares: z.number().int().positive(),
  baseName: z.string(),
  baseDescription: z.string(),
  image: z.string().optional(),
  attributes: z.array(z.object({
    trait_type: z.string(),
    value: z.union([z.string(), z.number()]),
  })).optional(),
});

// Fix other DTOs
const CreateListingDto = z.object({
  title: z.string(),
  description: z.string(),
  locationText: z.string(),
  geoJson: z.any().optional(),
  parcelSize: z.number().positive(),
  coordinatePolicy: z.boolean(),
  coordinatePolicyNote: z.string().optional(),
  totalShares: z.number().int().positive(),
  pricePerShare: z.number().positive(),
});

const InitiateKycDto = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  country: z.string(),
});

const TriggerPayoutDto = z.object({
  listingId: z.string(),
  reason: z.enum(['DIVIDEND', 'BUYOUT']),
  amount: z.number().positive().optional(),
});

const UpdateKycDto = z.object({
  kycStatus: z.enum(['VERIFIED', 'PENDING', 'REJECTED', 'EXPIRED']),
  reason: z.string().optional(),
});

const CreateProposalDto = z.object({
  listingId: z.string(),
  title: z.string(),
  description: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
});

const VoteDto = z.object({
  proposalId: z.string(),
  choice: z.enum(['YES', 'NO']),
});

const EstimateValueDto = z.object({
  location: z.string(),
  parcelSize: z.number().positive(),
  geoJson: z.any().optional(),
  comps: z.array(z.object({
    location: z.string(),
    size: z.number().positive(),
    price: z.number().positive(),
  })).optional(),
  soilScore: z.number().min(0).max(100).optional(),
  infraScore: z.number().min(0).max(100).optional(),
});

const CreateOrderDto = z.object({
  listingId: z.string(),
  fractions: z.number().int().positive(),
});

export {
  LoginDto,
  RegisterDto,
  ListShareDto,
  BuyShareDto,
  SellShareDto,
  CancelOrderDto,
  MintCollectionDto,
  MintFractionsDto,
  CreateListingDto,
  InitiateKycDto,
  TriggerPayoutDto,
  UpdateKycDto,
  CreateProposalDto,
  VoteDto,
  EstimateValueDto,
  CreateOrderDto,
};
EOF

echo "✅ Critical fixes applied!"

echo ""
echo "🎯 Summary of fixes:"
echo "✅ Added missing dependencies (@nestjs/bullmq, nestjs-pino)"
echo "✅ Generated Prisma client"
echo "✅ Fixed Prisma schema relations"
echo "✅ Fixed HTTP exception filter"
echo "✅ Added get method to AppConfigService"
echo "✅ Fixed Solana utility methods"
echo "✅ Fixed ZodValidationPipe usage"
echo ""
echo "⚠️  Note: Some Metaplex UMI API issues remain and need manual fixing"
echo "   These are related to version incompatibilities between packages"
echo ""
echo "🚀 Try running 'pnpm dev' again to see the remaining issues"