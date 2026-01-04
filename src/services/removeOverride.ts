import { featureflags } from "../schema/feature";

type OverrideLevel = "user" | "group" | "region";

export class RemoveOverride {
  featureKey: string;
  level: OverrideLevel;
  entityId: string;

  constructor(featureKey: string, level: OverrideLevel, entityId: string) {
    this.featureKey = featureKey;
    this.level = level;
    this.entityId = entityId;
  }

  async remove() {
    const feature = await featureflags.findOne({ key: this.featureKey });

    if (!feature) {
      return { status: 404, message: "Feature not found" };
    }

    switch (this.level) {
      case "user":
        feature.overrides?.users.delete(this.entityId);
        break;

      case "group":
        feature.overrides?.groups.delete(this.entityId);
        break;

      case "region":
        feature.overrides?.regions.delete(this.entityId);
        break;

      default:
        return { status: 400, message: "Invalid override level" };
    }

    await feature.save();

    return { status: 200, message: "Override removed successfully" };
  }
}
