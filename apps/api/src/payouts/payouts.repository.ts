import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PayoutsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany<T extends Prisma.PayoutFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.PayoutFindManyArgs>
  ) {
    return this.prisma.payout.findMany(args);
  }

  async findUnique<T extends Prisma.PayoutFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.PayoutFindUniqueArgs>
  ) {
    return this.prisma.payout.findUnique(args);
  }

  async findFirst<T extends Prisma.PayoutFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.PayoutFindFirstArgs>
  ) {
    return this.prisma.payout.findFirst(args);
  }

  async create<T extends Prisma.PayoutCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PayoutCreateArgs>
  ) {
    return this.prisma.payout.create(args);
  }

  async update<T extends Prisma.PayoutUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PayoutUpdateArgs>
  ) {
    return this.prisma.payout.update(args);
  }

  async delete<T extends Prisma.PayoutDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.PayoutDeleteArgs>
  ) {
    return this.prisma.payout.delete(args);
  }

  async count<T extends Prisma.PayoutCountArgs>(
    args?: Prisma.SelectSubset<T, Prisma.PayoutCountArgs>
  ) {
    return this.prisma.payout.count(args);
  }

  async aggregate<T extends Prisma.PayoutAggregateArgs>(args: T) {
    return this.prisma.payout.aggregate(args);
  }

  async upsert<T extends Prisma.PayoutUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.PayoutUpsertArgs>
  ) {
    return this.prisma.payout.upsert(args);
  }
}