import { users } from './helpers.js';


export const resolveIndexByUserId = (req, res, next) => {
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
