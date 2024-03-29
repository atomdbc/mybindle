import express from 'express';
import Post from '../model/post.model.js'; 
import Story from '../model/story.model.js';
import asyncHandler from "express-async-handler"
import mongoose from "mongoose";
import { getCloudUser, Cloudstatus } from "../utils/cloudBalance.js";



const makePost = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try{
      const { desc, photo, location, friendTags, sharewithgroups, sharewithpages } = req.body;
      const userId = mongoose.Types.ObjectId(req.params.user_id);
    
      // Create an object with only the fields that are present in the request body
      const postFields = {
        desc,
        photo,
        postedBy: userId,
        location,
      };
    
      // Add optional fields if they are present
      if (friendTags) postFields.friendTags = friendTags;
      if (sharewithgroups) postFields.sharewithgroups = sharewithgroups;
      if (sharewithpages) postFields.sharewithpages = sharewithpages;
    
      const newPost = new Post(postFields);
    
      const savedPost = await newPost.save();
      return res.status(201).json(savedPost);
    } catch(error) {
      return res.status(500).json({error: error})
    }
  });
  


// @desc    Get all posts for a user
// @route   GET /api/posts
// @access  Private
const getPostsForUser = asyncHandler(async (req, res) => {
  if (req.user.user.id != req.params.user_id) {
    return res.status(401).json({error: "Unauthorized"});
  };
  try{
    const userId = mongoose.Types.ObjectId(req.params.user_id);
    const posts = await Post.find({ postedBy: userId }).populate('postedBy', 'username');
  
    return res.status(200).json(posts);
  } catch(error) {
    return res.status(500).json({error: error})
  }
  });
  
  // @desc    Get a specific post for a user
  // @route   GET /api/posts/:postId
  // @access  Private
  const getPostForUser = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
      return res.status(401).json({error: "Unauthorized"});
    };
    try{
    // const userId = mongoose.Types.ObjectId(req.params.user_id);
    const postId = mongoose.Types.ObjectId(req.params.post_id);
  
    const post = await Post.findOne({ _id: postId }).populate('postedBy', 'username');
    const userActivePlan = await getCloudUser(userId);
    console.log(userActivePlan);
    if (userActivePlan.activePlan!='free') {
      await Cloudstatus(userActivePlan)
    }
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    } else {
     return  res.status(200).json(post);
    }

  } catch(error) {
    return res.status(500).json({error: error})
  }
  });
  
  // @desc    Delete a specific post for a user
  // @route   DELETE /api/posts/:postId
  // @access  Private
  const deletePostForUser = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const userId = req.params.user_id; // Corrected
        const postId = req.params.post_id; // Corrected

        const post = await Post.findOne({ _id: postId, postedBy: userId });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        } else {
            await post.remove();
            return res.status(204).json({ success: 'Post deleted successfully' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


  const toggleLikeToPost = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
      return res.status(401).json({error: "Unauthorized"});
    };
    try {
      const userId = mongoose.Types.ObjectId(req.params.user_id);
      const postId = mongoose.Types.ObjectId(req.params.post_id);
  
      const post = await Post.findById(postId);
  
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
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
  


  const addCommentToPost = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
      return res.status(401).json({error: "Unauthorized"});
    };
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
  

  const makeStory = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { videoUrl, friendTags, shareWithGroups, shareWithPages, description } = req.body;
        console.log(req.body);
        const userId = mongoose.Types.ObjectId(req.params.user_id);

        const storyFields = {
            videoUrl,
            postedBy: userId,
            description, // Add description field
            createdAt: new Date() // Add timestamp for post creation
        };

        if (friendTags) storyFields.friendTags = friendTags;
        if (shareWithGroups) storyFields.shareWithGroups = shareWithGroups;
        if (shareWithPages) storyFields.shareWithPages = shareWithPages;

        const newStory = new Story(storyFields);

        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 24);

        newStory.expiresAt = expirationTime;

        const savedStory = await newStory.save();
        return res.status(201).json(savedStory);
    } catch (error) {
        console.error("Error creating story:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



  const getStoryForUser = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      const userId = mongoose.Types.ObjectId(req.params.user_id);
      const stories = await Story.find({ postedBy: userId }).populate('postedBy', 'username');
      
      console.log("User ID:", userId);

      return res.status(200).json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  const getSpecificStory = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      const userId = mongoose.Types.ObjectId(req.params.user_id);
      const postId = mongoose.Types.ObjectId(req.params.post_id);
  
      const story = await Story.findOne({ _id: postId, postedBy: userId }).populate('postedBy', 'username');
  
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
  
      return res.status(200).json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  const deleteSpecificStory = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      const userId = mongoose.Types.ObjectId(req.params.user_id);
      const postId = mongoose.Types.ObjectId(req.params.post_id);
  
      const story = await Story.findOne({ _id: postId, postedBy: userId });
  
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
  
      // Delete the story
      await story.remove();
  
      return res.status(200).json({ message: "Story deleted successfully" });
    } catch (error) {
      console.error("Error deleting story:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  const toggleLikeToStory = asyncHandler(async (req, res) => {
    if (req.user.user.id != req.params.user_id) {
      return res.status(401).json({error: "Unauthorized"});
    };
    try {
      const userId = mongoose.Types.ObjectId(req.params.user_id);
      const storyid = mongoose.Types.ObjectId(req.params.post_id);
  
      const story = await Story.findById(storyid);
  
      if (!story) {
        res.status(404).json({ error: 'Story not found' });
      } else {
        const indexOfUser = story.likes.indexOf(userId);
  
        if (indexOfUser !== -1) {
          // User has already liked the post, unlike it
          story.likes.splice(indexOfUser, 1);
        } else {
          // User has not liked the post, add the like
          story.likes.push(userId);
        }
  
        const updatedPost = await story.save();
        return res.status(200).json(updatedPost);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
  



export { getPostsForUser, getPostForUser, deletePostForUser, addCommentToPost, toggleLikeToPost, makePost, makeStory, getStoryForUser, getSpecificStory , deleteSpecificStory, toggleLikeToStory };

