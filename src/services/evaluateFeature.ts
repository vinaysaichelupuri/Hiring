import { featureflags } from "../schema/feature";

type FeatureContext = {
  userId?: string;
  groups?: string[];
  region?: string;
};

export class EvaluateFeature {
  featureKey: string;
  context: FeatureContext;

  constructor(featureKey: string, context: FeatureContext) {
    this.featureKey = featureKey;
    this.context = context;
  }

  async isEnabled() {
    const feature = await featureflags.findOne({ key: this.featureKey });

    if (!feature) {
      return { status: 404, message: "Feature not found" };
    }
    if (this.context.userId) {
      const userOverride = feature.overrides?.users.get(this.context.userId);
      if (userOverride !== undefined) {
        return { status: 200, enabled: userOverride, source: "user" };
      }
    }

    if (this.context.groups) {
      for (const groupId of this.context.groups) {
        const groupOverride = feature.overrides?.groups.get(groupId);
        if (groupOverride !== undefined) {
          return { status: 200, enabled: groupOverride, source: "group" };
        }
      }
    }

    if (this.context.region) {
      const regionOverride = feature.overrides?.regions.get(this.context.region);
      if (regionOverride !== undefined) {
        return { status: 200, enabled: regionOverride, source: "region" };
      }
    }

    return {
      status: 200,
      enabled: feature.enabled,
      source: "global",
    };
  }
}
