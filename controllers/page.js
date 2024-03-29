import express from 'express';
import Page from '../model/page.model.js'; 
import asyncHandler from "express-async-handler"
import mongoose from "mongoose";
import { getCloudUser, Cloudstatus } from "../utils/cloudBalance.js";



/**
 * @desc    Create a new page
 * @route   POST /api/pages
 * @access  Private
 */
export const createPage = asyncHandler(async (req, res) => {
  try {
    if (req.user.user.id != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.params.user_id;
    req.body.admin = mongoose.Types.ObjectId(userId);
    req.body.createdBy = mongoose.Types.ObjectId(userId);
  
    const page = await Page.create(req.body);
    const userActivePlan = await getCloudUser(userId);
    console.log(userActivePlan);
    if (userActivePlan.activePlan!='free') {
      await Cloudstatus(userActivePlan)
    }
    
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error creating page' });
  }
});


/**
 * @desc    Get a specific page by ID
 * @route   GET /api/pages/:pageId
 * @access  Private
 */
export const getPageById = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    const pageId = mongoose.Types.ObjectId(req.params.page_id);
    const page = await Page.findById(pageId);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
    } else {
      await Page.findByIdAndUpdate(pageId, { $inc: { views: 1 } }, { new: true });
      res.status(200).json(page);
    }
    const userActivePlan = await getCloudUser(req.params.user_id);
    console.log(userActivePlan);
    if (userActivePlan.activePlan!='free') {
      await Cloudstatus(userActivePlan)
    }
  } catch (error) {
    console.error('Error getting page by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const getPageByUserId = asyncHandler(async (req, res) =>{
  try {
    const userId =  req.params.user_id;
    
    const pages = await Page.find({createdBy: userId})
    res.status(200).json(pages);
    const userActivePlan = await getCloudUser(userId);
    console.log(userActivePlan);
    if (userActivePlan.activePlan!='free') {
      await Cloudstatus(userActivePlan)
    }
  } catch (error) {
    console.error('Error getting pages by user ID', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

/**
 * @desc    Update a page by ID
 * @route   PUT /api/pages/:pageId
 * @access  Private
 */
export const updatePage = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    // const fieldd = ["title",
    //               "slug",
    //               "public",
    //               "Age_restiction",
    //               "moderators_edit",
    //               "profile_picture",
    //               "cover_picture",
    //               "desc",
    //               "posts",
    //               "views"
    //             ]

    // for()
    const pageId = mongoose.Types.ObjectId(req.params.pageId);
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
export const deletePage = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    const pageId = mongoose.Types.ObjectId(req.params.pageId);
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
export const incrementPageViews = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    const pageId = mongoose.Types.ObjectId(req.params.pageId);
    const page = await Page.findByIdAndUpdate(pageId, { $inc: { views: 1 } }, { new: true });
    res.status(200).json(page);
  } catch (error) {
    console.error('Error incrementing page views:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Toggle like for a page
 * @route   PUT /api/pages/:pageId/toggle-like/:user_id
 * @access  Private
 */
export const toggleLikePage = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };

  try {
    const userId = mongoose.Types.ObjectId(req.params.user_id);
    const pageId = mongoose.Types.ObjectId(req.params.pageId);
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
 * @route   PUT /api/pages/:pageId/toggle-follow/:user_id
 * @access  Private
 */
export const toggleFollowPage = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  const userId = mongoose.Types.ObjectId(req.params.user_id);
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
export const addModeratorsToPage = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    const pageId = mongoose.Types.ObjectId(req.params.pageId);
    const moderatorIds = req.body.moderatorIds;
    const page = await Page.findById(pageId);

    moderatorIds.forEach((moderatorId) => {
      if (!page.moderators.includes(moderatorId)) {
        page.moderators.push(moderatorId);
      } else {
        return res.status(400).json({error: `User ${moderatorId} is already a moderator of the page.`});
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
export const removeModeratorsFromPage = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  
  try {
    const pageId = mongoose.Types.ObjectId(req.params.pageId);
  const moderatorIds = req.body.moderatorIds.map((id) => mongoose.Types.ObjectId(id));
    const page = await Page.findByIdAndUpdate(
      pageId,
      { $pullAll: { moderators: moderatorIds } },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Check if any provided moderatorIds were not found in page.moderators
    // const notFoundModerators = moderatorIds.filter((moderatorId) => !page.moderators.includes(moderatorId));

    // if (notFoundModerators.length > 0) {
    //   console.warn(`The following moderatorIds were not found in page.moderators: ${notFoundModerators}`);
    // }

    res.status(200).json(page);
  } catch (error) {
    console.error('Error removing moderators:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @desc    Create new questions
 * @route   POST /api/pages/:pageId/questions
 * @access  Private
 */
export const createQuestions = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    const { pageId } = req.params;
    const questions = req.body;

    // Convert pageId to Mongoose ObjectId
    const mongoosePageId = mongoose.Types.ObjectId(pageId);

    const updatedPage = await Page.findByIdAndUpdate(
      mongoosePageId,
      { $push: { joining_questions: { $each: questions } } },
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.status(201).json(updatedPage);
  } catch (error) {
    console.error('Error creating questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





/**
 * @desc    Get questions for a page
 * @route   GET /api/pages/:pageId/questions
 * @access  Public
 */
export const getQuestions = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    const { pageId } = req.params;

    // Convert pageId to Mongoose ObjectId
    const mongoosePageId = mongoose.Types.ObjectId(pageId);

    // Find the page by ID and retrieve the joining_questions array
    const page = await Page.findById(mongoosePageId, 'joining_questions');

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.status(200).json(page.joining_questions);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @desc    Update questions
 * @route   PUT /api/pages/:pageId/questions
 * @access  Private
 */
export const updateQuestions = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    const { pageId } = req.params;
    const updatedQuestions = req.body;

    // Convert pageId to Mongoose ObjectId
    const mongoosePageId = mongoose.Types.ObjectId(pageId);

    const existingPage = await Page.findById(mongoosePageId);

    if (!existingPage) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const updatedPage = {
      ...existingPage.toObject(), // Convert Mongoose model to plain JavaScript object
      joining_questions: existingPage.joining_questions.map((question) => {
        const updatedQuestion = updatedQuestions.find((q) => q._id.toString() === question._id.toString());
        return updatedQuestion ? { ...question.toObject(), ...updatedQuestion } : question;
      }),
    };

    // Save the updated page
    const savedPage = await existingPage.updateOne(updatedPage, { new: true });

    res.status(200).json(savedPage);
  } catch (error) {
    console.error('Error updating questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



/**
 * @desc    Delete questions by ID
 * @route   DELETE /api/pages/:pageId/questions
 * @access  Private
 */
export const deleteQuestionsById = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try {
    const { pageId } = req.params;
    const questionIdsToDelete = req.body;

    // Convert pageId to Mongoose ObjectId
    const mongoosePageId = mongoose.Types.ObjectId(pageId);

    // Find the page by ID
    const existingPage = await Page.findById(mongoosePageId);

    if (!existingPage) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Filter out questions to delete
    const questionsToKeep = existingPage.joining_questions.filter(
      (question) => !questionIdsToDelete.includes(question._id.toString())
    );

    // Update the page with the remaining questions
    const updatedPage = {
      ...existingPage.toObject(),
      joining_questions: questionsToKeep,
    };

    // Save the updated page
    const savedPage = await existingPage.updateOne(updatedPage, { new: true });

    res.status(200).json(savedPage);
  } catch (error) {
    console.error('Error deleting questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

