import { Router } from 'express';
import { users } from '../utils/helpers.js';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import {
  createUserValidationSchema,
  editUserValidationSchema,
  patchUserValidationSchema
} from '../utils/validationSchemas.mjs';
import { resolveIndexByUserId } from '../utils/middleware.js';


const router = Router();

router.get('/api/users', (req, res) => {
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

router.post('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).send({ errors: result.array() });
  const data = matchedData(req);
  // console.log('result: ', result);
  // console.log('data: ', data);
  const newUser = { id: users[users.length - 1].id + 1, ...data };

  users.push(newUser);
  return res.status(201).send(newUser);
});

router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  // check if user exists
  const findUser = users[userIndex];
  return (findUser) ? res.send(findUser) : res.status(404).send({ msg: 'User not found' });
});

router.put('/api/users/:id', checkSchema(editUserValidationSchema), resolveIndexByUserId, (req, res) => {
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

router.patch('/api/users/:id', resolveIndexByUserId, checkSchema(patchUserValidationSchema), (req, res) => {
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

router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;

  // remove user
  const deletedUser = users.splice(userIndex, 1);
  // console.log('deletedUser', deletedUser);
  return res.sendStatus(200);
});

export default router;
