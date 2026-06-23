import { Router } from 'express';
import { replayDeadJob } from '../controllers/admin.controller.js';

const router = Router();

router.post('/dlq/replay/:deadLetterId', replayDeadJob)

export default router;