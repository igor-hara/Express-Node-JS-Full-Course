import { Router } from 'express';

import usersRouter from './users.js';
import productsRouter from './products.js';


const router = Router();

// ALL ROUTES
router.use([usersRouter, productsRouter]);

export default router;
