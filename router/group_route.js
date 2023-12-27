import express from 'express';
  
import { createGroup, deleteGroup, joinGroup, leaveGroup, makeGroupAdmin,getGroupAdmins,getGroups,generateSlug,toggleMuteStatus, updateGroup,} from '../controllers/groupController.js';
import { authenticate } from '../middleWare/auth.js';
const groupRouter = express.Router();

groupRouter.post('/groups/create', authenticate, createGroup);
groupRouter.post('/groups/delete', authenticate, deleteGroup);
groupRouter.post('/groups/update', authenticate,  updateGroup);
groupRouter.post('/groups/join', authenticate, joinGroup);
groupRouter.post('/groups/leave', authenticate, leaveGroup);
groupRouter.post('/groups/make-admin', authenticate, makeGroupAdmin);
groupRouter.get('/groups/admins/:groupId',authenticate, getGroupAdmins);
groupRouter.get('/groups', authenticate, getGroups);
groupRouter.post('/groups/slug', authenticate, generateSlug);
groupRouter.post('/groups/mute-unmute', authenticate, toggleMuteStatus);


 
export default groupRouter;


// 654a7c287a18d97412a0bf3d
// 654a7be5b5b60816c3e96ad3
// 654a7bfeb5b60816c3e96ad7