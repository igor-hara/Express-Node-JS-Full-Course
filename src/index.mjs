import express from 'express';
import morgan from 'morgan';
import { query, body, validationResult, matchedData, checkSchema } from 'express-validator';
import {
  createUserValidationSchema,
  editUserValidationSchema,
  patchUserValidationSchema
} from './utils/validationSchemas.mjs';


const app = express();

app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, name: 'John', username: 'JohnDoe' },
  { id: 2, name: 'Jane', username: 'JaneDoe' },
  { id: 3, name: 'Joe', username: 'JoeDoe' },
  { id: 4, name: 'Jim', username: 'JimDoe' },
  { id: 5, name: 'Tina', username: 'TinaDoe' },
  { id: 6, name: 'Henry', username: 'HenryDoe' },
  { id: 7, name: 'Adam', username: 'AdamDoe' },
];

// middleware
const resolveIndexByUserId = (req, res, next) => {
  const { params: { id } } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  // find users index
  const userIndex = users.findIndex(user => user.id === parsedId);
  // if user does not exist value is: -1
  if (userIndex === -1) return res.sendStatus(404);
  req.userIndex = userIndex;
  next();
};

app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Hello' });
});

app.get('/api/users', (req, res) => {
  const { filter, value } = req.query;

  // check if filter and value exist
  if (!filter || !value) {
    return res.send(users);
  }
  // search users by query string
  // /api/users?filter=name&value=ji
  res.send(
    users.filter(user => user[filter].toLowerCase().includes(value))
  );
});

app.post('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });
  const data = matchedData(req);
  // console.log('result: ', result);
  // console.log('data: ', data);
  const newUser = { id: users[users.length - 1].id + 1, ...data };
  
  users.push(newUser);
  return res.status(201).send(newUser);
});

app.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  // check if user exists
  const findUser = users[userIndex];
  return (findUser) ? res.send(findUser) : res.status(404).send({ msg: 'User not found' });
});

app.put('/api/users/:id', checkSchema(editUserValidationSchema), resolveIndexByUserId, (req, res) => {
  const { body, userIndex, params: { id } } = req;

  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });
  const data = matchedData(req);

  // update user
  users[userIndex] = {
    // id: users[userIndex].id,
    id,
    ...data
  };
  return res.sendStatus(200);
});

app.patch('/api/users/:id', resolveIndexByUserId, checkSchema(patchUserValidationSchema), (req, res) => {
  const { body, userIndex } = req;

  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });
  const data = matchedData(req);

  // prvo zaljepi sve stare vrijednosti usera i zatim samo updataju one koje se nalaze u body
  users[userIndex] = {
    ...users[userIndex],
    ...data
  };
  return res.sendStatus(200);
});

app.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;

  // remove user
  const deletedUser = users.splice(userIndex, 1);
  // console.log('deletedUser', deletedUser);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// PUT - updates every single field
// PATCH - update specific property of an user, product like username or price
// DELETE
