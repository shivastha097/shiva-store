import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";

import { REVIEW_PLUGIN_OPTIONS } from "./constants";
import { PluginInitOptions } from "./types";
import { Review } from "./entities/review.entity";
import { ReviewService } from "./services/review.service";
import { ReviewAdminResolver } from "./api/review-admin.resolver";
import { adminApiExtensions, shopApiExtensions } from "./api/api-extensions";
import { ReviewShopResolver } from "./api/review-shop.resolver";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    { provide: REVIEW_PLUGIN_OPTIONS, useFactory: () => ReviewPlugin.options },
    ReviewService,
  ],
  configuration: (config) => {
    // Plugin-specific configuration
    // such as custom fields, custom permissions,
    // strategies etc. can be configured here by
    // modifying the `config` object.
    return config;
  },
  compatibility: "^3.0.0",
  entities: [Review],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [ReviewAdminResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ReviewShopResolver],
  },
})
export class ReviewPlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<ReviewPlugin> {
    this.options = options;
    return ReviewPlugin;
  }
}
