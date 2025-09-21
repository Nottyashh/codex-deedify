import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.usersRepository.findMany({
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          walletAddress: true,
          kycStatus: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.usersRepository.count(),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string) {
    const user = await this.usersRepository.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            listings: true,
            ordersAsSeller: true,
            ordersAsBuyer: true,
            votes: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, data: {
    role?: 'INVESTOR' | 'LISTER' | 'ADMIN';
    kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
    walletAddress?: string;
  }) {
    // Validate wallet address if provided
    if (data.walletAddress) {
      const isValidWallet = this.isValidSolanaAddress(data.walletAddress);
      if (!isValidWallet) {
        throw new BadRequestException('Invalid Solana wallet address');
      }

      // Check if wallet is already in use by another user
      const existingWallet = await this.usersRepository.findFirst({
        where: {
          walletAddress: data.walletAddress,
          id: { not: id },
        },
      });

      if (existingWallet) {
        throw new BadRequestException('Wallet address is already in use');
      }
    }

    const user = await this.usersRepository.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
        kycStatus: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User updated: ${user.email}`);

    return user;
  }

  async updateKycStatus(id: string, data: {
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
    reason?: string;
  }) {
    const user = await this.usersRepository.update({
      where: { id },
      data: {
        kycStatus: data.kycStatus,
      },
      select: {
        id: true,
        email: true,
        kycStatus: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User KYC status updated: ${user.email} -> ${user.kycStatus}`);

    return {
      ...user,
      reason: data.reason,
    };
  }

  async getUserListings(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const user = await this.usersRepository.findUnique({
      where: { id: userId },
      select: {
        listings: {
          skip,
          take: limit,
          orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            locationText: true,
            parcelSize: true,
            totalShares: true,
            pricePerShare: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: { listings: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userListings = user.listings ?? [];
    const total = user._count?.listings ?? userListings.length;

    return {
      data: userListings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getUserOrders(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const user = await this.usersRepository.findUnique({
      where: { id: userId },
      select: {
        ordersAsSeller: {
          orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
          select: {
            id: true,
            type: true,
            price: true,
            status: true,
            txSignature: true,
            createdAt: true,
            listing: {
              select: {
                id: true,
                title: true,
                locationText: true,
              },
            },
          },
        },
        ordersAsBuyer: {
          orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
          select: {
            id: true,
            type: true,
            price: true,
            status: true,
            txSignature: true,
            createdAt: true,
            listing: {
              select: {
                id: true,
                title: true,
                locationText: true,
              },
            },
          },
        },
        _count: {
          select: {
            ordersAsSeller: true,
            ordersAsBuyer: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const combinedOrders = [...(user.ordersAsSeller ?? []), ...(user.ordersAsBuyer ?? [])];
    combinedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const total = (user._count?.ordersAsSeller ?? 0) + (user._count?.ordersAsBuyer ?? 0);
    const paginatedOrders = combinedOrders.slice(skip, skip + limit);

    return {
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getUserVotes(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const user = await this.usersRepository.findUnique({
      where: { id: userId },
      select: {
        votes: {
          skip,
          take: limit,
          orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
          select: {
            id: true,
            choice: true,
            weightDecimal: true,
            createdAt: true,
            proposal: {
              select: {
                id: true,
                title: true,
                description: true,
                status: true,
                endsAt: true,
                listing: {
                  select: {
                    id: true,
                    title: true,
                    locationText: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userVotes = user.votes ?? [];
    const total = user._count?.votes ?? userVotes.length;

    return {
      data: userVotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  private isValidSolanaAddress(address: string): boolean {
    try {
      // Basic validation - in production, use a proper Solana address validator
      return address.length >= 32 && address.length <= 44;
    } catch {
      return false;
    }
  }
}