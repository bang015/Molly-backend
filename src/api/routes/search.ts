import { Router, Request, Response, NextFunction } from "express";
import { getSearchResult } from "../../services/search";

const searchRouter = Router();

searchRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { query } = req.query as any;
    const result = await getSearchResult(query);
    return res.status(200).json(result);
  } catch {}
});

export default searchRouter;
