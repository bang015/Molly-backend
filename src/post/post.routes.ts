import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { checkJWT } from '../common/middleware/checkJwt';
import { uploadPostMedias } from '../common/middleware/multer';
import { IJwtRequest } from '..//interfaces/auth';
import {
  explorePostList,
  postList,
  getPost,
  getPostByTag,
  postDelete,
  postUpdate,
  verifyPostUser,
  createPost,
  bookmarkPostList,
  deletePostImage
} from './post.service';
import { MediaType } from '../interfaces/post';
import { v2 as cloudinary } from 'cloudinary';
import { getUser } from '../user/user.service';
import { selectFollowing } from '../follow/follow.service';

const postRouter = Router();
// 게시물 생성
postRouter.post(
  '/',
  checkJWT,
  uploadPostMedias,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded.id;
      const { content, hashtags } = req.body;
      const user = await getUser({ id: userId });
      if (!user) {
        return res.status(404).json({ error: '권한이 없습니다.' });
      }
      const medias: MediaType[] = (req.files as Express.Multer.File[]).map(
        (file: Express.Multer.File) => {
          return {
            name: file.filename,
            path: file.path,
            type: file.mimetype,
          };
        },
      );
      const postData = { userId, content };
      const newPost = await createPost(postData, medias, hashtags || []);
      const post = await getPost(newPost.id);
      return res
        .status(200)
        .json({ post, message: '게시물이 공유 되었습니다.' });
    } catch (e) {
      const files = req.files as Express.Multer.File[];
      files.map((media) => {
        cloudinary.uploader.destroy(media.filename, function (result: any) {});
      });
      return next(e);
    }
  },
);

// 게시물 수정
postRouter.patch(
  '/',
  checkJWT,
  uploadPostMedias,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const { postId, content, hashtags } = req.body;
      await verifyPostUser(postId, userId);
      const updatedPost = await postUpdate(postId, content, hashtags || []);
      return res.status(200).json({ updatedPost });
    } catch (e) {
      return next(e);
    }
  },
);

// 메인 게시물
postRouter.get(
  '/main',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded.id;
      const { page } = req.query as any;
      const followedUsers = await selectFollowing(userId);
      let userIds = [];
      if (followedUsers) {
        userIds = followedUsers.map((follow) => follow.id);
      }
      userIds.push(userId);
      const response = await postList(userIds, page);
      return res.status(200).json(response);
    } catch (e) {
      return next(e);
    }
  },
);

// 추천 게시물
postRouter.get(
  '/',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded.id;
      const { page } = req.query as any;
      const followedUsers = await selectFollowing(userId);
      let userIds = [];
      if (followedUsers) {
        userIds = followedUsers.map((follow) => follow.id);
      }
      userIds.push(userId);
      const allPost = await explorePostList(userIds, page);
      if (allPost) {
        return res.status(200).json(allPost);
      }
    } catch (e) {
      return next(e);
    }
  },
);

// 게시물 상세정보
postRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = parseInt(req.params.id, 10);
    try {
      const post = await getPost(postId);
      if (!post) {
        return res.status(404).json({ error: '존재하지 않는 게시물입니다.' });
      }
      return res.status(200).json(post);
    } catch (e) {
      return next(e);
    }
  },
);

// 유저 게시물
postRouter.get(
  '/my/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId, 10);
    const { page } = req.query as any;
    try {
      const post = await postList(userId, page, 12);
      res.status(200).json(post);
    } catch (e) {
      next(e);
    }
  },
);

// 북마크 게시물
postRouter.get(
  '/bookmark/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId, 10);
    const { page } = req.query as any;
    try {
      const post = await bookmarkPostList(userId, page, 12);
      res.status(200).json(post);
    } catch (e) {
      next(e);
    }
  },
);

// 게시물 태그 검색
postRouter.get(
  '/tags/:tagName',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tagName } = req.params;
      const { page } = req.query as any;
      const post = await getPostByTag(tagName, page);
      return res.status(200).json(post);
    } catch (e) {
      return next(e);
    }
  },
);

// 게시물 삭제
postRouter.delete(
  '/:id',
  checkJWT,
  async (req: IJwtRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.decoded?.id;
      const postId = parseInt(req.params.id, 10);
      await verifyPostUser(postId, userId);
      await deletePostImage(postId);
      await postDelete(postId);
      return res
        .status(200)
        .json({ postId, message: '게시물이 삭제되었습니다.' });
    } catch (e) {
      return next(e);
    }
  },
);
export default postRouter;
