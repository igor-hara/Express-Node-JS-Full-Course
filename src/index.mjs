import express from 'express';
import morgan from 'morgan';

import usersRouter from './routes/users.js';


const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// PUT - updates every single field
// PATCH - update specific property of an user, product like username or price
// DELETE
