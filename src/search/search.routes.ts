import { Router, Request, Response, NextFunction } from 'express';
import { getSearchResult } from './search.service';
import { checkJWT } from '../common/middleware/checkJwt';
import client from '../common/config/redis';
import { JwtRequest } from '../auth/auth.interfaces';

const searchRouter = Router();

// 검색
searchRouter.get(
  '/:type',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query as any;
      const type = req.params.type;
      const result = await getSearchResult(query, type);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  },
);

// 검색어 목록 업데이트
searchRouter.post(
  '/history',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    const userId = req.decoded?.id;
    const { result } = req.body;
    const timestamp = Date.now();
    const reversedTimestamp = Math.floor(timestamp / 1000) * -1;
    const member = JSON.stringify(result);
    const cacheKey = `searchUId:${userId}`;
    client.ZSCORE(
      cacheKey,
      member,
      (err: Error | null, reply: string | null) => {
        if (err) {
          return next(err);
        } else {
          // 같은 검색어가 있으면 시간을 갱신
          if (reply !== null) {
            client.ZADD(
              cacheKey,
              reversedTimestamp,
              member,
              (err: Error | null, reply: number | null) => {
                if (err) {
                  return next(err);
                } else {
                  return res.status(200).json();
                }
              },
            );
          } else {
            // 같은 검색어가 없으면 새로 추가
            client.ZADD(
              cacheKey,
              reversedTimestamp,
              member,
              (err: Error | null, reply: number | null) => {
                if (err) {
                  return next(err);
                } else {
                  return res.status(200).json();
                }
              },
            );
          }
        }
      },
    );
  },
);

// 검색어 목록
searchRouter.get(
  '/history1',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    const userId = req.decoded?.id;
    const cacheKey = `searchUId:${userId}`;
    client.zRange(
      cacheKey,
      0,
      -1,
      (err: Error | null, reply: string[] | null) => {
        if (err) {
          return next(err);
        } else {
          if (reply?.length) {
            const response = reply.map((history) => {
              return JSON.parse(history);
            });
            return res.status(200).json(response);
          } else {
            return res.status(200).json([]);
          }
        }
      },
    );
  },
);

// 검색어 삭제
searchRouter.delete(
  '/history',
  checkJWT,
  async (req: JwtRequest, res: Response, next: NextFunction) => {
    const userId = req.decoded?.id;
    const history = req.body;
    const cacheKey = `searchUId:${userId}`;
    if (!history) {
      client.del(cacheKey, (err: Error | null, reply: string | null) => {
        if (err) {
          return next(err);
        } else {
          return res.status(200).json();
        }
      });
    } else {
      client.zrem(
        cacheKey,
        history,
        (err: Error | null, reply: string | null) => {
          if (err) {
            return next(err);
          } else {
            return res.status(200).json();
          }
        },
      );
    }
  },
);
export default searchRouter;
