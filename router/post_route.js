// Import the functions above
import {
    addCommentToPost,
    toggleLikeToPost,
    makePost,
    getPostsForUser,
    getPostForUser,
    deleteStoryForUser,
    toggleLikeToStory,
    createStory,
    getUserStories,
    getAllStories
  } from '../controllers/post.js';
  
  import { Router } from "express";
  
  const postRouter = Router();
  
  // Routes for user posts
  postRouter.post('/create-post/:user_id', makePost);
  postRouter.get('/get-posts/:user_id', getPostsForUser);
  postRouter.get('/get-post/:user_id/:post_id', getPostForUser);
  postRouter.post('/comment/:user_id/:post_id', addCommentToPost);
  postRouter.get('/like/:user_id/:post_id', toggleLikeToPost);
  
  // Routes for stories
  postRouter.post('/create-story/:user_id', createStory);
  postRouter.get('/get-user-stories/:user_id', getUserStories);
  postRouter.get('/get-all-stories', getAllStories);
  postRouter.post('/delete-story/:user_id/:story_id', deleteStoryForUser);
  postRouter.post('/like-story/:user_id/:story_id', toggleLikeToStory);
  
  export default postRouter;
  