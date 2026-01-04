import { featureflags } from "../schema/feature";

export class GetFeatures {
    constructor() {}
  async getAll() {
    const features = await featureflags.find();
    return { status: 200, data: features };
  }

  async getByKey(key: string) {
    const feature = await featureflags.findOne({ key });

    if (!feature) {
      return { status: 404, message: "Feature not found" };
    }

    return { status: 200, data: feature };
  }
}
