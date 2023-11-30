import {
    createPage,
    getPageById,
    updatePage,
    deletePage,
    incrementPageViews,
    toggleLikePage,
    toggleFollowPage,
    addModeratorsToPage,
    removeModeratorsFromPage
  } from '../controllers/page.js';
  import { Router } from "express";
  
  const pageRouter = Router();
  
  // Add routes for pages
  
  pageRouter.post('/create-page', createPage);
  pageRouter.get('/get-page/:pageId', getPageById);
  pageRouter.put('/update-page/:pageId', updatePage);
  pageRouter.delete('/delete-page/:pageId', deletePage);
  pageRouter.put('/increment-views/:pageId', incrementPageViews);
  pageRouter.put('/toggle-like/:pageId/:userId', toggleLikePage);
  pageRouter.put('/toggle-follow/:pageId/:userId', toggleFollowPage);
  pageRouter.put('/add-moderators/:pageId', addModeratorsToPage);
  pageRouter.put('/remove-moderators/:pageId', removeModeratorsFromPage);
  
  export default pageRouter;
  