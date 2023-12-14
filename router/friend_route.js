import express from 'express';
import {handleFriendRequest, handleBlockUser, manageArchive} from '../controllers/friendController.js';

const friendRoute = express.Router();

friendRoute.post('/handle-request', handleFriendRequest);
friendRoute.post('/handle-block', handleBlockUser);
friendRoute.post('/manage-archive', manageArchive)


export default friendRoute;