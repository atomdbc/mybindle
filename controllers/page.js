import express from 'express';
import Page from '../model/page.model.js'; 
import asyncHandler from "express-async-handler"
import mongoose from "mongoose";


/**
 * @desc    Create a new page
 * @route   POST /api/pages
 * @access  Private
 */
const createPage = asyncHandler(async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Get a specific page by ID
 * @route   GET /api/pages/:pageId
 * @access  Private
 */
const getPageById = asyncHandler(async (req, res) => {
  const pageId = mongoose.Types.ObjectId(req.params.pageId);

  try {
    const page = await Page.findById(pageId);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
    } else {
      res.status(200).json(page);
    }
  } catch (error) {
    console.error('Error getting page by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Update a page by ID
 * @route   PUT /api/pages/:pageId
 * @access  Private
 */
const updatePage = asyncHandler(async (req, res) => {
  const pageId = mongoose.Types.ObjectId(req.params.pageId);

  try {
    const page = await Page.findByIdAndUpdate(pageId, req.body, { new: true });
    res.status(200).json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Delete a page by ID
 * @route   DELETE /api/pages/:pageId
 * @access  Private
 */
const deletePage = asyncHandler(async (req, res) => {
  const pageId = mongoose.Types.ObjectId(req.params.pageId);

  try {
    const result = await Page.findByIdAndDelete(pageId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Increment page views
 * @route   PUT /api/pages/:pageId/increment-views
 * @access  Private
 */
const incrementPageViews = asyncHandler(async (req, res) => {
  const pageId = mongoose.Types.ObjectId(req.params.pageId);

  try {
    const page = await Page.findByIdAndUpdate(pageId, { $inc: { views: 1 } }, { new: true });
    res.status(200).json(page);
  } catch (error) {
    console.error('Error incrementing page views:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Toggle like for a page
 * @route   PUT /api/pages/:pageId/toggle-like/:userId
 * @access  Private
 */
const toggleLikePage = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);
  const pageId = mongoose.Types.ObjectId(req.params.pageId);

  try {
    const page = await Page.findById(pageId);

    if (!page) {
      res.status(404).json({ error: 'Page not found' });
    } else {
      const indexOfUser = page.likes.indexOf(userId);

      if (indexOfUser !== -1) {
        page.likes.splice(indexOfUser, 1);
      } else {
        page.likes.push(userId);
      }

      const updatedPage = await page.save();
      res.status(200).json(updatedPage);
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Toggle follow for a page
 * @route   PUT /api/pages/:pageId/toggle-follow/:userId
 * @access  Private
 */
const toggleFollowPage = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);
  const pageId = mongoose.Types.ObjectId(req.params.pageId);

  try {
    const page = await Page.findById(pageId);

    if (!page) {
      res.status(404).json({ error: 'Page not found' });
    } else {
      const indexOfUser = page.followers.indexOf(userId);

      if (indexOfUser !== -1) {
        page.followers.splice(indexOfUser, 1);
      } else {
        page.followers.push(userId);
      }

      const updatedPage = await page.save();
      res.status(200).json(updatedPage);
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Add moderators to a page
 * @route   PUT /api/pages/:pageId/add-moderators
 * @access  Private
 */
const addModeratorsToPage = asyncHandler(async (req, res) => {
  const pageId = mongoose.Types.ObjectId(req.params.pageId);
  const moderatorIds = req.body.moderatorIds;

  try {
    const page = await Page.findById(pageId);

    moderatorIds.forEach((moderatorId) => {
      if (!page.moderators.includes(moderatorId)) {
        page.moderators.push(moderatorId);
      } else {
        throw new Error(`User ${moderatorId} is already a moderator of the page.`);
      }
    });

    await page.save();
    res.status(200).json(page);
  } catch (error) {
    console.error('Error adding moderators:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Remove moderators from a page
 * @route   PUT /api/pages/:pageId/remove-moderators
 * @access  Private
 */
const removeModeratorsFromPage = asyncHandler(async (req, res) => {
  const pageId = mongoose.Types.ObjectId(req.params.pageId);
  const moderatorIds = req.body.moderatorIds;

  try {
    const page = await Page.findByIdAndUpdate(
      pageId,
      { $pullAll: { moderators: moderatorIds } },
      { new: true }
    );

    moderatorIds.forEach((moderatorId) => {
      if (!page.moderators.includes(moderatorId)) {
        throw new Error(`User ${moderatorId} is not a moderator of the page.`);
      }
    });

    res.status(200).json(page);
  } catch (error) {
    console.error('Error removing moderators:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
  
  