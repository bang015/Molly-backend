import { Router } from 'express';
import users from './users';
import auth from './auth';
import post from './post';
const router = Router();

router.use('/users', users);
router.use('/auth', auth);
router.use('/post', post);
export default router;