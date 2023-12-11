import express from 'express';
import Post from '../model/post.model.js'; 
import asyncHandler from "express-async-handler"
import mongoose from "mongoose";


const makePost = asyncHandler(async (req, res) => {
  try {
    const { desc, photo, location, friendTags, sharewithgroups, sharewithpages, isStory } = req.body;
    const userId = mongoose.Types.ObjectId(req.params.userId);

    // Create an object with only the fields that are present in the request body
    const postFields = {
      desc,
      photo,
      postedBy: userId,
      location,
      isStory: isStory || false, // Default to false if isStory is not provided
    };

    // Add optional fields if they are present
    if (friendTags) postFields.friendTags = friendTags;
    if (sharewithgroups) postFields.sharewithgroups = sharewithgroups;
    if (sharewithpages) postFields.sharewithpages = sharewithpages;

    // If it's a story, set the storyExpiresAt to 24 hours from now
    if (postFields.isStory) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
      postFields.storyExpiresAt = expiresAt;
    }

    const newPost = new Post(postFields);

    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

  
  const createStory = asyncHandler(async (req, res) => {
    try {
      const { desc, photo, location, friendTags, sharewithgroups, sharewithpages } = req.body;
      const userId = mongoose.Types.ObjectId(req.params.userId);
  
      // Create an object with only the fields that are present in the request body
      const storyFields = {
        desc,
        photo,
        postedBy: userId,
        location,
        isStory: true, // Set to true for a story
      };
  
      // Add optional fields if they are present
      if (friendTags) storyFields.friendTags = friendTags;
      if (sharewithgroups) storyFields.sharewithgroups = sharewithgroups;
      if (sharewithpages) storyFields.sharewithpages = sharewithpages;
  
      // Calculate the expiration time for the story (24 hours from now)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
      storyFields.storyExpiresAt = expiresAt;
  
      const newStory = new Post(storyFields);
  
      const savedStory = await newStory.save();
      return res.status(201).json(savedStory);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  });
  

  const getUserStories = asyncHandler(async (req, res) => {
    try {
      const userId = req.params.user_id; // Change to req.params.user_id
      console.log('User ID:', userId);
  
      const stories = await Post.find({
        postedBy: userId,
        isStory: true,
        storyExpiresAt: { $gte: new Date() },
      }).sort({ storyExpiresAt: -1 });
  
      console.log('Retrieved Stories:', stories);
      return res.status(200).json(stories);
    } catch (error) {
      console.error('Error in getUserStories:', error);
      return res.status(500).json({ error: error.message });
    }
  });
  
  
  
  
  const getAllStories = asyncHandler(async (req, res) => {
    try {
      // Retrieve all stories, including both active and expired ones
      const currentTimestamp = new Date();
      const stories = await Post.find({
        isStory: true,
        $or: [
          { storyExpiresAt: { $exists: false } }, // Active stories without expiration time
          { storyExpiresAt: { $gte: currentTimestamp } }, // Expired stories with expiration time greater than or equal to current time
        ],
      }).sort({ storyExpiresAt: -1 }); // Sort by expiration time descending
  
      return res.status(200).json(stories);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  });
  
  
// @desc    Get all posts for a user
// @route   GET /api/posts/user/:user_id
// @access  Public
const getPostsForUser = asyncHandler(async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.user_id);
    const posts = await Post.find({ postedBy: userId }).populate('postedBy', 'username');

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// @desc    Get a specific post for a user
// @route   GET /api/posts/:post_id
// @access  Public
const getPostForUser = asyncHandler(async (req, res) => {
  try {
    const postId = mongoose.Types.ObjectId(req.params.post_id);

    const post = await Post.findOne({ _id: postId }).populate('postedBy', 'username');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    } else {
      return res.status(200).json(post);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

  

 // @desc    Delete a post for a user
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePostForUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await Post.findOne({ _id: postId, postedBy: userId });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    } else {
      await post.remove();
      return res.status(204).json({ success: 'Post deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// @desc    Toggle like to a post
// @route   POST /api/posts/:post_id/like/:user_id
// @access  Private
const toggleLikeToPost = asyncHandler(async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.user_id);
    const postId = mongoose.Types.ObjectId(req.params.post_id);

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    } else {
      const indexOfUser = post.likes.indexOf(userId);

      if (indexOfUser !== -1) {
        // User has already liked the post, unlike it
        post.likes.splice(indexOfUser, 1);
      } else {
        // User has not liked the post, add the like
        post.likes.push(userId);
      }

      const updatedPost = await post.save();
      return res.status(200).json(updatedPost);
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// @desc    Add a comment to a post
// @route   POST /api/posts/:post_id/comment/:user_id
// @access  Private
const addCommentToPost = asyncHandler(async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.user_id);
    const postId = mongoose.Types.ObjectId(req.params.post_id);
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required." });
    }

    const comment = {
      text,
      userId,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// @desc    Delete a story for a user
// @route   DELETE /api/stories/:storyId
// @access  Private
const deleteStoryForUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.user_id;
    const storyId = req.params.story_id;

    const story = await Post.findOne({ _id: storyId, postedBy: userId, isStory: true });

    if (!story) {
      return res.status(404).json({ error: 'Story not found or you do not have permission to delete it' });
    } else {
      await story.remove();
      return res.status(204).json({ success: 'Story deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// @desc    Toggle like to a story
// @route   POST /api/stories/:story_id/like/:user_id
// @access  Private
const toggleLikeToStory = asyncHandler(async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.user_id);
    const storyId = mongoose.Types.ObjectId(req.params.story_id);

    const story = await Post.findById(storyId);

    if (!story || !story.isStory) {
      return res.status(404).json({ error: 'Story not found' });
    } else {
      const indexOfUser = story.likes.indexOf(userId);

      if (indexOfUser !== -1) {
        // User has already liked the story, unlike it
        story.likes.splice(indexOfUser, 1);
      } else {
        // User has not liked the story, add the like
        story.likes.push(userId);
      }

      const updatedStory = await story.save();
      return res.status(200).json(updatedStory);
    }
  } catch (error) {
    console.error('Error toggling like on story:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


    



export {
  getPostsForUser,
  getPostForUser,
  deletePostForUser,
  addCommentToPost,
  toggleLikeToPost,
  makePost,
  deleteStoryForUser,
  toggleLikeToStory,
  createStory,
  getUserStories,
  getAllStories
};

