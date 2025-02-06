import { Router } from 'express';
import { signin, signup, updateURL, getPresignUrl } from './users.controller';
import { checkToken } from './users.middleware';

const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).json({ data: "hello world" });

});
router.post('/sign-in', signin);
router.post('/sign-up', signup);
router.post('/presign', checkToken, getPresignUrl);
router.put('/update-url', checkToken, updateURL);

export default router;