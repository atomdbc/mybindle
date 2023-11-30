import express from 'express';
  
  import { createGroup, deleteGroup, joinGroup, leaveGroup, makeGroupAdmin,getGroupAdmins,getGroups,generateSlug,toggleMuteStatus, updateGroup,} from '../controllers/groupController.js';

const groupRouter = express.Router();

groupRouter.post('/groups/create', createGroup);
groupRouter.post('/groups/delete', deleteGroup);
groupRouter.post('/groups/update', updateGroup);
groupRouter.post('/groups/join', joinGroup);
groupRouter.post('/groups/leave', leaveGroup);
groupRouter.post('/groups/make-admin', makeGroupAdmin);
groupRouter.get('/groups/admins/:groupId', getGroupAdmins);
groupRouter.get('/groups', getGroups);
groupRouter.post('/groups/slug',generateSlug);
groupRouter.post('/groups/mute-unmute',toggleMuteStatus);


 
export default groupRouter;


// 654a7c287a18d97412a0bf3d
// 654a7be5b5b60816c3e96ad3
// 654a7bfeb5b60816c3e96ad7