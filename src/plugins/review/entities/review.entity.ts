import {
  Customer,
  DeepPartial,
  Order,
  ProductVariant,
  Seller,
  VendureEntity,
} from "@vendure/core";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Review extends VendureEntity {
  constructor(input?: DeepPartial<Review>) {
    super(input);
  }

  @Column()
  rating: number;

  @Column("text", { nullable: true })
  comment: string;

  @ManyToOne(() => Customer, (customer) => customer.id, {
    onDelete: "CASCADE",
  })
  customer: Customer;

  @ManyToOne(() => ProductVariant, (variant) => variant.id, {
    nullable: false,
    onDelete: "CASCADE",
  })
  productVariant: ProductVariant;

  @ManyToOne(() => Order, (order) => order.id, { nullable: false })
  order: Order;

  @ManyToOne(() => Seller, (seller) => seller.id, { nullable: false })
  seller: Seller;
}
