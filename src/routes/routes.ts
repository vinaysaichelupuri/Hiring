import express, { Request, Response } from "express";
import { CreateFeature } from "../services/createOrUpdateFeature";
import { AddOverride } from "../services/addOverride";
import { RemoveOverride } from "../services/RemoveOverride";
import { EvaluateFeature } from "../services/EvaluateFeature";
import { GetFeatures } from "../services/getFeature";

const router = express.Router();

router.post("/features", async (req: Request, res: Response) => {
  const { key, description, enabled } = req.body;

  if (!key) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const service = new CreateFeature(key, description, enabled);
  const result = await service.createFeature();

  return res.status(result.status).json(result);
});

router.get("/features", async (_req: Request, res: Response) => {
  const service = new GetFeatures();
  const result = await service.getAll();
  return res.status(200).json(result);
});

router.put("/features", async (req: Request, res: Response) => {
  const { key, description, enabled } = req.body;

  if (!key) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const service = new CreateFeature(key, description, enabled);
  const result = await service.updateFeature();

  return res.status(result.status).json(result);
});

router.get("/features/:key", async (req: Request, res: Response) => {
  const { key } = req.params;

  const service = new GetFeatures();
  const result = await service.getByKey(key);

  return res.status(result.status).json(result);
});

router.put("/features/:key/overrides", async (req: Request, res: Response) => {
  const { key } = req.params;
  const { level, entityId, enabled } = req.body;

  if (!level || !entityId) {
    return res.status(400).json({ message: "Invalid override data" });
  }

  const service = new AddOverride(key, level, entityId, enabled);
  const result = await service.addOrUpdateOverride();

  return res.status(result.status).json(result);
});

router.delete(
  "/features/:key/overrides",
  async (req: Request, res: Response) => {
    const { key } = req.params;
    const { level, entityId } = req.body;

    if (!level || !entityId) {
      return res.status(400).json({ message: "Invalid override data" });
    }

    const service = new RemoveOverride(key, level, entityId);
    const result = await service.remove();

    return res.status(result.status).json(result);
  }
);

router.get("/features/:key/evaluate", async (req: Request, res: Response) => {
  const { key } = req.params;
  const { userId, groups, region } = req.query;

  const service = new EvaluateFeature(key, {
    userId: userId as string | undefined,
    groups: groups ? (groups as string).split(",") : undefined,
    region: region as string | undefined,
  });

  const result = await service.isEnabled();
  return res.status(result.status).json(result);
});

router.put("/features/:key", async (req: Request, res: Response) => {
  const { key, description, enabled } = req.body;

  const service = new CreateFeature(key, description, enabled);
  const result = await service.updateFeature();

  return res.status(result.status).json(result);
});

export default router;
