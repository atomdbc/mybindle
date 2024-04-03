import express from 'express';

import { createCloud, getCloudUser, upgradeCloud } from '../controllers/cloudcontroller.js';
const cloudRouter= express.Router();

cloudRouter.post('/create-cloud', createCloud)
cloudRouter.get('/get-cloud-user/:user_id', getCloudUser)
cloudRouter.post('/upgrade-cloud/:user_id', upgradeCloud)


export default cloudRouter;
