// Import the functions above
import {addCommentToPost, toggleLikeToPost, makePost, getPostsForUser, getPostForUser, deletePostForUser } from '../controllers/post.js';
import { Router } from "express";
import { authenticate } from '../middleWare/auth.js';
const post_router = Router();

// Add routes for user posts



post_router.post('/create-post/:user_id', authenticate, makePost);
post_router.get('/get-posts/:user_id', authenticate, getPostsForUser);
post_router.get('/get-post/:user_id/:post_id', authenticate, getPostForUser);
post_router.delete('/delete-post/:user_id/:post_id', authenticate, deletePostForUser)

post_router.post('/comment/:user_id/:post_id', authenticate, addCommentToPost);
post_router.get('/like/:user_id/:post_id', authenticate, toggleLikeToPost);


export default post_router;