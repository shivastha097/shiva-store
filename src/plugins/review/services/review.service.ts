import { Inject, Injectable } from "@nestjs/common";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import { ID, PaginatedList } from "@vendure/common/lib/shared-types";
import {
  InternalServerError,
  ListQueryBuilder,
  ListQueryOptions,
  Order,
  ProductVariant,
  RelationPaths,
  RequestContext,
  Seller,
  TransactionalConnection,
  UserInputError,
  assertFound,
  patchEntity,
} from "@vendure/core";
import { REVIEW_PLUGIN_OPTIONS } from "../constants";
import { Review } from "../entities/review.entity";
import { PluginInitOptions } from "../types";

export interface CreateReviewInput {
  rating: number;
  comment: string;
  customerId: number;
  productVariantId: number;
  orderId: number;
  sellerId: number;
}

export interface UpdateReviewInput {
  id: ID;
  rating?: number;
  comment?: string;
}

@Injectable()
export class ReviewService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    @Inject(REVIEW_PLUGIN_OPTIONS) private options: PluginInitOptions
  ) {}

  findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Review>,
    relations?: RelationPaths<Review>
  ): Promise<PaginatedList<Review>> {
    return this.listQueryBuilder
      .build(Review, options, {
        relations,
        ctx,
      })
      .getManyAndCount()
      .then(([items, totalItems]) => {
        return {
          items,
          totalItems,
        };
      });
  }

  findOne(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<Review>
  ): Promise<Review | null> {
    return this.connection.getRepository(ctx, Review).findOne({
      where: { id },
      relations,
    });
  }

  async averageSellerRating(
    ctx: RequestContext,
    sellerId: string
  ): Promise<number> {
    const result = await this.connection
      .getRepository(ctx, Review)
      .createQueryBuilder("review")
      .select("AVG(review.rating)", "avgRating")
      .where("review.sellerId = :sellerId", { sellerId })
      .getRawOne();
    return parseFloat(result.avgRating) || 0;
  }

  async averageProductVariantRating(
    ctx: RequestContext,
    productVariantId: string
  ): Promise<number> {
    const result = await this.connection
      .getRepository(ctx, Review)
      .createQueryBuilder("review")
      .select("AVG(review.rating)", "avgRating")
      .where("review.productVariantId = :productVariantId", {
        productVariantId,
      })
      .getRawOne();
    return parseFloat(result.avgRating) || 0;
  }

  async create(ctx: RequestContext, input: CreateReviewInput): Promise<Review> {
    const { rating, comment, productVariantId, orderId, sellerId } = input;

    // Validate input
    if (!orderId || !productVariantId || !sellerId) {
      throw new UserInputError(
        "Missing required fields: orderId, productVariantId, or sellerId."
      );
    }

    if (rating < 0 || rating > 5)
      throw new UserInputError("Rating must be between 1 and 5");

    try {
      // Fetch entities in parallel
      const [order, productVariant, seller] = await Promise.all([
        this.connection.getEntityOrThrow(ctx, Order, orderId),
        this.connection.getEntityOrThrow(ctx, ProductVariant, productVariantId),
        this.connection.getEntityOrThrow(ctx, Seller, sellerId),
      ]);

      // Validate order ownership and state
      if (order.customerId !== ctx.activeUserId)
        throw new UserInputError("You can only review your own orders");

      if (order.state !== "Delivered")
        throw new UserInputError("You can only review completed orders.");

      // Create and save the review
      const review = new Review({
        rating,
        comment,
        productVariant,
        order,
        seller,
      });

      const createdReview = await this.connection
        .getRepository(ctx, Review)
        .save(review);

      return createdReview;
    } catch (error: any) {
      throw new InternalServerError(
        `Failed to create review: ${error.message}`
      );
    }
  }

  async update(ctx: RequestContext, input: UpdateReviewInput): Promise<Review> {
    const { id, rating } = input;

    if (rating !== undefined && (rating < 1 || rating > 5))
      throw new UserInputError("Rating must be between 1 and 5.");

    try {
      const review = await this.connection.getEntityOrThrow(ctx, Review, id);

      // Update the review
      const updatedReview = patchEntity(review, input);
      await this.connection
        .getRepository(ctx, Review)
        .save(updatedReview, { reload: false });
      return assertFound(this.findOne(ctx, updatedReview.id));
    } catch (error: any) {
      throw new InternalServerError(
        `Failed to update review: ${error.message}`
      );
    }
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    try {
      const review = await this.connection.getEntityOrThrow(ctx, Review, id);

      // Delete the review
      await this.connection.getRepository(ctx, Review).remove(review);
      return {
        result: DeletionResult.DELETED,
      };
    } catch (e: any) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: `Failed to delete review: ${e.toString()}`,
      };
    }
  }
}
