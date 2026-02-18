import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
    res.send('AlgoArena API');
});

export default router;
