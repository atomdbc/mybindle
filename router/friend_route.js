import express from 'express';
import {handleFriendRequest, handleBlockUser, manageArchive} from '../controllers/friendController.js';
import { authenticate } from '../middleWare/auth.js';


const friendRoute = express.Router();

friendRoute.post('/handle-request', authenticate, handleFriendRequest);
friendRoute.post('/handle-block', authenticate, handleBlockUser);
friendRoute.post('/manage-archive', authenticate, manageArchive)


export default friendRoute;