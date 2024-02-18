import express from 'express';
import {handleFriendRequest, acceptFriendRequest, getFriendRequests, deleteFriendRequest, handleBlockUser, manageArchive, getProfile, donationBadge} from '../controllers/friendController.js';
import { authenticate } from '../middleWare/auth.js';


const friendRoute = express.Router();

friendRoute.post('/handle-request', authenticate, handleFriendRequest);
friendRoute.post('/accept-request', authenticate, acceptFriendRequest);
friendRoute.get('/get-friend-request/:userId', authenticate, getFriendRequests);
friendRoute.post('/handle-block', authenticate, handleBlockUser);
friendRoute.post('/decline-request', authenticate, deleteFriendRequest);
friendRoute.post('/manage-archive', authenticate, manageArchive)
friendRoute.post('/user-profile/:userId', authenticate, (req, res) => {
    return getProfile(req, res);
  });
friendRoute.post('/donation-badge/:userId/:newBadge', authenticate, donationBadge)


export default friendRoute;