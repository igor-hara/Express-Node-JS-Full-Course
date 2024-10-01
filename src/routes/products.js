import {
  Router
} from 'express';


const router = Router();

router.get('/api/products', (req, res) => {
  const userCookie = req.cookies;
  console.log('header-cookie', req.headers.cookie);
  console.log('userCookie', userCookie);

  if (req.cookies && req.cookies['my-cookie']) {
    return res.send({ id: 1, prize: 12.99, product: 'chicken breasts' });
  } else {
    return res.status(403).send({ msg: 'Get some cookies' });
  }
});

export default router;
