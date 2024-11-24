import { Args, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  RelationPaths,
  Relations,
  RequestContext,
} from "@vendure/core";
import { Review } from "../entities/review.entity";
import { ReviewService } from "../services/review.service";

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
}
