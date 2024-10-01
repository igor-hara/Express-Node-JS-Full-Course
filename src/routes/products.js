import {
  Router
} from 'express';


const router = Router();

router.get('/api/products', (req, res) => {
  const userCookie = req.cookies;

  console.log('userCookie', userCookie);
  res.send({ id: 0, prize: 12.99, product: 'chicken breasts' });
});

export default router;
