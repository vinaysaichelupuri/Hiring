import { featureflags } from "../schema/feature";
export class CreateFeature {
  key: string;
  description: string;
  enabled: boolean;
  constructor(
    key: string,
    description: string,
    enabled: boolean,
  ) {
    (this.key = key),
      (this.description = description),
      (this.enabled = enabled);
  }
  async createFeature() {
    const feature = await featureflags.findOne({ key: this.key });
    if (feature) {
      return { status: 400 };
    } else {
      featureflags.create({
        key: this.key,
        description: this.description,
        enabled: this.enabled,
      });
      return { status: 200 };
    }
  }
  async updateFeature() {
    const feature = await featureflags.findOne({ key: this.key });
    if (feature) {
      feature.description = this.description;
      feature.enabled = this.enabled;
      await feature.save();
      return { status: 200 };
    } else {
      return { status: 404 };
    }
  }
}
