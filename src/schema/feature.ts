import mongoose from "mongoose";
export const featureflagsSchema = new mongoose.Schema({
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    overrides: {
      users: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
      groups: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
      regions: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
    },
  },
  {
    timestamps: true,
    collection: "featureflags",
  }
);

const featureflags = mongoose.model("featureflags", featureflagsSchema);
export { featureflags };
