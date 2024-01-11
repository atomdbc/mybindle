// Import the functions above
import {addCommentToPost, toggleLikeToPost, makePost, getPostsForUser, getPostForUser, deletePostForUser , makeStory , getStoryForUser ,getSpecificStory, deleteSpecificStory, toggleLikeToStory } from '../controllers/post.js';
import { Router } from "express";
import { authenticate } from '../middleWare/auth.js';
const post_router = Router();

post_router.post('/create-post/:user_id', authenticate, makePost);
post_router.get('/get-posts/:user_id', authenticate, getPostsForUser);
post_router.get('/get-post/:user_id/:post_id', authenticate, getPostForUser);
post_router.delete('/delete-post/:user_id/:post_id', authenticate, deletePostForUser)
post_router.post('/comment-post/:user_id/:post_id', authenticate, addCommentToPost);
post_router.get('/like/:user_id/:post_id', authenticate, toggleLikeToPost);
post_router.post('/create-story/:user_id', authenticate, makeStory);
post_router.get('/get-story/:user_id', authenticate, getStoryForUser);
post_router.get('/get-story/:user_id/:post_id', authenticate, getSpecificStory);
post_router.delete('/delete-story/:user_id/:post_id', authenticate, deleteSpecificStory)
post_router.get('/like-story/:user_id/:post_id', authenticate, toggleLikeToStory);







export default post_router;