import { featureflags } from "../schema/feature";

type OverrideLevel = "user" | "group" | "region";

export class AddOverride {
  featureKey: string;
  level: OverrideLevel;
  entityId: string;
  enabled: boolean;

  constructor(
    featureKey: string,
    level: OverrideLevel,
    entityId: string,
    enabled: boolean
  ) {
    this.featureKey = featureKey;
    this.level = level;
    this.entityId = entityId;
    this.enabled = enabled;
  }

  async addOrUpdateOverride() {
    const feature = await featureflags.findOne({ key: this.featureKey });

    if (!feature) {
      return { status: 404, message: "Feature not found" };
    }
    if (feature.overrides) {
      switch (this.level) {
        case "user":
          feature.overrides.users.set(this.entityId, this.enabled);
          break;

        case "group":
          feature.overrides.groups.set(this.entityId, this.enabled);
          break;

        case "region":
          feature.overrides.regions.set(this.entityId, this.enabled);
          break;

        default:
          return { status: 400, message: "Invalid override level" };
      }
    }

    await feature.save();

    return { status: 200, message: "Override applied successfully" };
  }
}
