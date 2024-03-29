import express from 'express';

import { createCloud, getCloudUser } from '../controllers/cloudcontroller.js';
const cloudRouter= express.Router();

cloudRouter.post('/create-cloud', createCloud)
cloudRouter.get('/get-cloud-user/:user_id', getCloudUser)

export default cloudRouter;
