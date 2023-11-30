import express from 'express';
import { createGroup, deleteGroup, joinGroup, leaveGroup, makeGroupadmin, getGroupMessage, postGroupMessage } from '../controllers/groupController.js';

const groupRouter = express.Router();

groupRouter.post('/groups/create', createGroup);
groupRouter.delete('/groups/delete', deleteGroup);
groupRouter.post('/groups/join', joinGroup);
groupRouter.post('/groups/leave', leaveGroup);
groupRouter.post('/groups/make-admin', makeGroupadmin);
groupRouter.get('/groups/messages/:groupId', getGroupMessage);
groupRouter.post('/groups/messages', postGroupMessage);

export default groupRouter;
