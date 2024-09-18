import {
  Router
} from 'express';


const router = Router();

router.get('/api/products', (req, res) => {
  res.send({ id: 0, prize: 12.99, product: 'chicken breasts' });
});

export default router;
