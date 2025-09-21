import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListingsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany<T extends Prisma.ListingFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.ListingFindManyArgs>
  ) {
    return this.prisma.listing.findMany(args);
  }

  async findUnique<T extends Prisma.ListingFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.ListingFindUniqueArgs>
  ) {
    return this.prisma.listing.findUnique(args);
  }

  async findFirst<T extends Prisma.ListingFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.ListingFindFirstArgs>
  ) {
    return this.prisma.listing.findFirst(args);
  }

  async create<T extends Prisma.ListingCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ListingCreateArgs>
  ) {
    return this.prisma.listing.create(args);
  }

  async update<T extends Prisma.ListingUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ListingUpdateArgs>
  ) {
    return this.prisma.listing.update(args);
  }

  async delete<T extends Prisma.ListingDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.ListingDeleteArgs>
  ) {
    return this.prisma.listing.delete(args);
  }

  async count<T extends Prisma.ListingCountArgs>(
    args?: Prisma.SelectSubset<T, Prisma.ListingCountArgs>
  ) {
    return this.prisma.listing.count(args);
  }

  async upsert<T extends Prisma.ListingUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.ListingUpsertArgs>
  ) {
    return this.prisma.listing.upsert(args);
  }
}