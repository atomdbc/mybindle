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
    updateQuestions,
    getQuestions,
    deleteQuestionsById
  } from '../controllers/page.js';
  import { Router } from "express";
  
  const pageRouter = Router();
  
  // Add routes for pages
  
  pageRouter.post('/create-page/:userId', createPage);
  pageRouter.get('/get-page/:pageId', getPageById);
  pageRouter.put('/update-page/:pageId', updatePage);
  pageRouter.delete('/delete-page/:pageId', deletePage);
  pageRouter.get('/increment-views/:pageId', incrementPageViews);
  pageRouter.get('/toggle-like/:pageId/:userId', toggleLikePage);
  pageRouter.get('/toggle-follow/:pageId/:userId', toggleFollowPage);
  pageRouter.put('/add-moderators/:pageId', addModeratorsToPage);
  pageRouter.put('/remove-moderators/:pageId', removeModeratorsFromPage);
  pageRouter.put('/create-question/:pageId', createQuestions);
  pageRouter.put('/update-question/:pageId', updateQuestions);
  pageRouter.get('/get-questions/:pageId', getQuestions);
  pageRouter.delete('/delete-question/:pageId', deleteQuestionsById);
  
  export default pageRouter;
  