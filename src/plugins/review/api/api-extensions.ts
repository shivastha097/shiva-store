import gql from "graphql-tag";

const commonApiExtensions = gql`
  type Review implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    rating: Int!
    comment: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

export const shopApiExtensions = gql`
  ${commonApiExtensions}

  input CreateReviewInput {
    rating: Int!
    comment: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input UpdateReviewInput {
    id: ID!
    rating: Int
    comment: String
    createdAt: DateTime
    updatedAt: DateTime
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
    avgSellerRating(sellerId: ID!): Float
    avgProductVariantRating(productVariantId: ID!): Float
  }

  # Generated at run-time by Vendure
  input ReviewListOptions

  type ReviewList implements PaginatedList {
    items: [Review!]!
    totalItems: Int!
  }
`;
