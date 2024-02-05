import { Router } from 'express';
import users from './users';
import auth from './auth';
import post from './post';
import follow from './follow';
import comment from './comment';
const router = Router();

router.use('/users', users);
router.use('/auth', auth);
router.use('/post', post);
router.use('/follow', follow);
router.use('/comment', comment);
export default router;