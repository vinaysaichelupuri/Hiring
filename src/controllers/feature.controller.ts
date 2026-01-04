import { Request, Response } from "express";
import { CreateFeature } from "../services/createOrUpdateFeature";
import { AddOverride } from "../services/addOverride";
import { RemoveOverride } from "../services/RemoveOverride";
import { EvaluateFeature } from "../services/EvaluateFeature";
import { GetFeatures } from "../services/getFeature";

/**
 * Controller for feature flag API endpoints
 */
export class FeatureController {
  createFeature = async (req: Request, res: Response): Promise<void> => {
    const { key, description, enabled } = req.body;
    const createFeature = new CreateFeature(key, description, enabled);
    const feature = await createFeature.createFeature();

    if (feature.status === 200) {
      res.status(200).json(feature);
    } else {
      res.status(feature.status).json(feature);
    }
  };

  addOverride = async (req: Request, res: Response): Promise<void> => {
    const { key, description, enabled, entityId } = req.body;
    const addOverride = new AddOverride(key, description, enabled, entityId);
    const feature = await addOverride.addOrUpdateOverride();

    if (feature.status === 200) {
      res.status(200).json(feature);
    } else {
      res.status(feature.status).json(feature);
    }
  };

  removeOverride = async (req: Request, res: Response): Promise<void> => {
    const { key, level, entityId } = req.body;
    const removeOverride = new RemoveOverride(key, level, entityId);
    const feature = await removeOverride.remove();

    if (feature.status === 200) {
      res.status(200).json(feature);
    } else {
      res.status(feature.status).json(feature);
    }
  };

  evaluateFeature = async (req: Request, res: Response): Promise<void> => {
    const { key, context } = req.body;
    const evaluateFeature = new EvaluateFeature(key, context);
    const feature = await evaluateFeature.isEnabled();

    if (feature.status === 200) {
      res.status(200).json(feature);
    } else {
      res.status(feature.status).json(feature);
    }
  };

  getFeature = async (req: Request, res: Response): Promise<void> => {
    const { key } = req.body;
    const getFeature = new GetFeatures();
    const feature = await getFeature.getByKey(key);

    if (feature.status === 200) {
      res.status(200).json(feature);
    } else {
      res.status(feature.status).json(feature);
    }
  };

  updateFeature = async (req: Request, res: Response): Promise<void> => {
    const { key, description, enabled } = req.body;
    const updateFeature = new CreateFeature(key, description, enabled);
    const feature = await updateFeature.updateFeature();

    if (feature.status === 200) {
      res.status(200).json(feature);
    } else {
      res.status(feature.status).json(feature);
    }
  };
}
