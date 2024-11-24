import { Args, Mutation, Resolver } from "@nestjs/graphql";
import {
  DeletionResponse,
  Permission,
} from "@vendure/common/lib/generated-types";
import { Allow, Ctx, ID, RequestContext, Transaction } from "@vendure/core";
import { Review } from "../entities/review.entity";
import {
  CreateReviewInput,
  ReviewService,
  UpdateReviewInput,
} from "../services/review.service";

@Resolver()
export class ReviewShopResolver {
  constructor(private reviewService: ReviewService) {}

  @Mutation()
  @Transaction()
  async createReview(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateReviewInput }
  ): Promise<Review> {
    return this.reviewService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.Owner)
  async updateReview(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateReviewInput }
  ): Promise<Review> {
    return this.reviewService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.Owner)
  async deleteReview(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<DeletionResponse> {
    return this.reviewService.delete(ctx, args.id);
  }
}
