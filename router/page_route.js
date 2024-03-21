import {
  createPage,
  getPageById,
  updatePage,
  deletePage,
  incrementPageViews,
  toggleLikePage,
  toggleFollowPage,
  addModeratorsToPage,
  removeModeratorsFromPage,
  createQuestions,
  getPageByUserId,
  updateQuestions,
  getQuestions,
  deleteQuestionsById
} from '../controllers/page.js';
import { Router } from "express";
import { authenticate } from '../middleWare/auth.js';

const pageRouter = Router();

// Add routes for pages

pageRouter.post('/create-page/:user_id', authenticate, createPage);
pageRouter.get('/get-page/:pageId/:user_id', authenticate, getPageById);
pageRouter.put('/update-page/:pageId/:user_id', authenticate, updatePage);
pageRouter.get('/get-page/:user_id', authenticate, getPageByUserId);
pageRouter.delete('/delete-page/:pageId/:user_id', authenticate, deletePage);
pageRouter.get('/increment-views/:pageId/:user_id', authenticate, incrementPageViews);
pageRouter.get('/toggle-like/:pageId/:user_id', authenticate, toggleLikePage);
pageRouter.get('/toggle-follow/:pageId/:user_id', authenticate, toggleFollowPage);
pageRouter.put('/add-moderators/:pageId/:user_id', authenticate, addModeratorsToPage);
pageRouter.put('/remove-moderators/:pageId/:user_id', authenticate, removeModeratorsFromPage);
pageRouter.put('/create-question/:pageId/:user_id', authenticate, createQuestions);
pageRouter.put('/update-question/:pageId/:user_id', authenticate, updateQuestions);
pageRouter.get('/get-questions/:pageId/:user_id', authenticate, getQuestions);
pageRouter.delete('/delete-question/:pageId/:user_id', authenticate, deleteQuestionsById);

export default pageRouter;
