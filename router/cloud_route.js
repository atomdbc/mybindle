import express from 'express';

import { createCloud, getCloudUser, upgradeCloud } from '../controllers/cloudcontroller.js';
const cloudRouter= express.Router();
import { authenticate } from '../middleWare/auth.js';


cloudRouter.post('/create-cloud',authenticate, createCloud)
cloudRouter.get('/get-cloud-user/:user_id',authenticate, getCloudUser)
cloudRouter.post('/upgrade-cloud/:user_id',authenticate, upgradeCloud)


export default cloudRouter;
