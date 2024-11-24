# Review and Rating Feature for Vendure app [shiva-shop]

---

## Overview
This feature add a `Review` entity to the Vendure application, enabling users to leave reviews for `Seller` and `Product Variant`. It also includes queries to calculate average ratings for sellers and product variants.

---

1. **Review Entity**
   - `rating` (integer): User rating between 1 and 5.
   - `comment` (string): Optional text for additional feedback.
   - **Relationships**:
     - `Seller`: Associates the review with a seller.
     - `ProductVariant`: Associates the review with a specific product variant.
     - `Order`: Ensures the review is linked to a completed order.
     - `Customer`: Tracks which customer created the review.

2. **Review CRUD Operations**
   - **Create**: Users can create reviews for their completed orders.
   - **Update/Delete**: Users can update or delete their own reviews.

3. **Queries for Average Ratings**
   - `averageSellerRating`: Retrieves the average rating for a seller.
   - `averageProductVariantRating`: Retrieves the average rating for a product variant.

---

## Usage

### Create Review
Allows a customer to create a review for a completed order.

**Mutation:**
```graphql
mutation {
    createReview(input: {
        rating: 5,
        comment: "Amazing product!",
        orderId: "ORDER_ID",
        productVariantId: "VARIANT_ID",
        sellerId: "SELLER_ID"
    }) {
        id
        rating
        comment
        createdAt
    }
}
```

### Update Review
Allows a customer to update their own review.

**Mutation:**
```graphql
mutation {
    updateReview(id: "REVIEW_ID", input: {
        rating: 4,
        comment: "Updated review text"
    }) {
        id
        rating
        comment
        updatedAt
    }
}
```

### Delete Review
Allows a customer to delete their own review.

**Mutation:**
```graphql
mutation {
deleteReview(id: "REVIEW_ID") {
    success
}
}
```

### Query for average rating for a specific seller
Calculates the average rating for a specific seller

**Query:**
```graphql
query {
    averageSellerRating(sellerId: "SELLER_ID")
}
```

### Query for average rating for a specific seller
Calculates the average rating for a specific seller

**Query:**
```graphql
query {
  averageProductVariantRating(productVariantId: "VARIANT_ID")
}
```