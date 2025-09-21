import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NftsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany<T extends Prisma.ShareTokenFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.ShareTokenFindManyArgs>
  ) {
    return this.prisma.shareToken.findMany(args);
  }

  async findUnique<T extends Prisma.ShareTokenFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.ShareTokenFindUniqueArgs>
  ) {
    return this.prisma.shareToken.findUnique(args);
  }

  async findFirst<T extends Prisma.ShareTokenFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.ShareTokenFindFirstArgs>
  ) {
    return this.prisma.shareToken.findFirst(args);
  }

  async create<T extends Prisma.ShareTokenCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ShareTokenCreateArgs>
  ) {
    return this.prisma.shareToken.create(args);
  }

  async update<T extends Prisma.ShareTokenUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ShareTokenUpdateArgs>
  ) {
    return this.prisma.shareToken.update(args);
  }

  async delete<T extends Prisma.ShareTokenDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.ShareTokenDeleteArgs>
  ) {
    return this.prisma.shareToken.delete(args);
  }

  async count<T extends Prisma.ShareTokenCountArgs>(
    args?: Prisma.SelectSubset<T, Prisma.ShareTokenCountArgs>
  ) {
    return this.prisma.shareToken.count(args);
  }

  async upsert<T extends Prisma.ShareTokenUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.ShareTokenUpsertArgs>
  ) {
    return this.prisma.shareToken.upsert(args);
  }
}