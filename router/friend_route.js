import express from 'express';
import {handleFriendRequest, handleBlockUser, manageArchive, getProfile, donationBadge} from '../controllers/friendController.js';
import { authenticate } from '../middleWare/auth.js';


const friendRoute = express.Router();

friendRoute.post('/handle-request', authenticate, handleFriendRequest);
friendRoute.post('/handle-block', authenticate, handleBlockUser);
friendRoute.post('/manage-archive', authenticate, manageArchive)
friendRoute.post('/user-profile/:userId', authenticate, (req, res) => {
    return getProfile(req, res);
  });
friendRoute.post('/donation-badge/:userId/:newBadge', authenticate, donationBadge)


export default friendRoute;