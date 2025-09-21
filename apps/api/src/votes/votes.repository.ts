import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VotesRepository {
  constructor(private prisma: PrismaService) {}

  async findProposals<T extends Prisma.ProposalFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.ProposalFindManyArgs>
  ) {
    return this.prisma.proposal.findMany(args);
  }

  async findProposal<T extends Prisma.ProposalFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProposalFindUniqueArgs>
  ) {
    return this.prisma.proposal.findUnique(args);
  }

  async createProposal<T extends Prisma.ProposalCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProposalCreateArgs>
  ) {
    return this.prisma.proposal.create(args);
  }

  async updateProposal<T extends Prisma.ProposalUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProposalUpdateArgs>
  ) {
    return this.prisma.proposal.update(args);
  }

  async deleteProposal<T extends Prisma.ProposalDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProposalDeleteArgs>
  ) {
    return this.prisma.proposal.delete(args);
  }

  async countProposals<T extends Prisma.ProposalCountArgs>(
    args?: Prisma.SelectSubset<T, Prisma.ProposalCountArgs>
  ) {
    return this.prisma.proposal.count(args);
  }

  async findVotes<T extends Prisma.VoteFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.VoteFindManyArgs>
  ) {
    return this.prisma.vote.findMany(args);
  }

  async findVote<T extends Prisma.VoteFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.VoteFindUniqueArgs>
  ) {
    return this.prisma.vote.findUnique(args);
  }

  async createVote<T extends Prisma.VoteCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.VoteCreateArgs>
  ) {
    return this.prisma.vote.create(args);
  }

  async updateVote<T extends Prisma.VoteUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.VoteUpdateArgs>
  ) {
    return this.prisma.vote.update(args);
  }

  async upsertVote<T extends Prisma.VoteUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.VoteUpsertArgs>
  ) {
    return this.prisma.vote.upsert(args);
  }

  async deleteVote<T extends Prisma.VoteDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.VoteDeleteArgs>
  ) {
    return this.prisma.vote.delete(args);
  }

  async countVotes<T extends Prisma.VoteCountArgs>(
    args?: Prisma.SelectSubset<T, Prisma.VoteCountArgs>
  ) {
    return this.prisma.vote.count(args);
  }
}