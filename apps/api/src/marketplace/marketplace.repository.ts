import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarketplaceRepository {
  constructor(private prisma: PrismaService) {}

  async findMany<T extends Prisma.OrderFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.OrderFindManyArgs>
  ) {
    return this.prisma.order.findMany(args);
  }

  async findUnique<T extends Prisma.OrderFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderFindUniqueArgs>
  ) {
    return this.prisma.order.findUnique(args);
  }

  async findFirst<T extends Prisma.OrderFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderFindFirstArgs>
  ) {
    return this.prisma.order.findFirst(args);
  }

  async create<T extends Prisma.OrderCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderCreateArgs>
  ) {
    return this.prisma.order.create(args);
  }

  async update<T extends Prisma.OrderUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderUpdateArgs>
  ) {
    return this.prisma.order.update(args);
  }

  async delete<T extends Prisma.OrderDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderDeleteArgs>
  ) {
    return this.prisma.order.delete(args);
  }

  async count<T extends Prisma.OrderCountArgs>(
    args?: Prisma.SelectSubset<T, Prisma.OrderCountArgs>
  ) {
    return this.prisma.order.count(args);
  }

  async aggregate<T extends Prisma.OrderAggregateArgs>(args: T) {
    return this.prisma.order.aggregate(args);
  }

  async upsert<T extends Prisma.OrderUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderUpsertArgs>
  ) {
    return this.prisma.order.upsert(args);
  }
}