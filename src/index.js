import express from 'express';
import morgan from 'morgan';

// import usersRouter from './routes/users.js';
// import productsRouter from './routes/products.js';
import routes from './routes/index.js';


const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// PUT - updates every single field
// PATCH - update specific property of an user, product like username or price
// DELETE
