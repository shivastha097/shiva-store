import gql from "graphql-tag";

const commonApiExtensions = gql`
  type Review implements Node {
    id: ID!
    rating: Int!
    comment: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    order: Order
    productVariant: ProductVariant
    seller: Seller
  }
`;

export const shopApiExtensions = gql`
  ${commonApiExtensions}

  input CreateReviewInput {
    rating: Int!
    comment: String!
    orderId: ID!
    productVariantId: ID!
    sellerId: ID!
  }

  input UpdateReviewInput {
    id: ID!
    rating: Int
    comment: String
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    updateReview(input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): DeletionResponse!
  }
`;

export const adminApiExtensions = gql`
  ${commonApiExtensions}

  extend type Query {
    review(id: ID!): Review
    reviews(options: ReviewListOptions): ReviewList!
    averageSellerRating(sellerId: ID!): Float
    averageProductVariantRating(productVariantId: ID!): Float
  }

  # Generated at run-time by Vendure
  input ReviewListOptions

  type ReviewList implements PaginatedList {
    items: [Review!]!
    totalItems: Int!
  }
`;
