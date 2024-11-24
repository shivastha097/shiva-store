import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DeletionResponse } from "@vendure/common/lib/generated-types";
import {
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  RelationPaths,
  Relations,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { Review } from "../entities/review.entity";
import {
  CreateReviewInput,
  ReviewService,
  UpdateReviewInput,
} from "../services/review.service";

@Resolver()
export class ReviewAdminResolver {
  constructor(private reviewService: ReviewService) {}

  @Query()
  async review(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
    @Relations(Review) relations: RelationPaths<Review>
  ): Promise<Review | null> {
    return this.reviewService.findOne(ctx, args.id, relations);
  }

  @Query()
  async reviews(
    @Ctx() ctx: RequestContext,
    @Args() args: { options: ListQueryOptions<Review> },
    @Relations(Review) relations: RelationPaths<Review>
  ): Promise<PaginatedList<Review>> {
    return this.reviewService.findAll(
      ctx,
      args.options || undefined,
      relations
    );
  }

  @Query()
  async averageSellerRating(
    @Ctx() ctx: RequestContext,
    @Args("sellerId") sellerId: string
  ): Promise<number> {
    const result = await this.reviewService.averageSellerRating(ctx, sellerId);
    return result || 0;
  }

  @Query()
  async averageProductVariantRating(
    @Ctx() ctx: RequestContext,
    @Args("productVariantId") productVariantId: string
  ): Promise<number> {
    const result = await this.reviewService.averageProductVariantRating(
      ctx,
      productVariantId
    );
    return result || 0;
  }

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
  async updateReview(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateReviewInput }
  ): Promise<Review> {
    return this.reviewService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  async deleteReview(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<DeletionResponse> {
    return this.reviewService.delete(ctx, args.id);
  }
}
