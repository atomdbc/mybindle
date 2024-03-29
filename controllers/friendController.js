import asyncHandler from 'express-async-handler';
import userModel from '../model/user.model.js'; // Adjust the path based on your project structure

// Controller to handle sending and removing friend requests
export const handleFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Authenticate user
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if both sender and receiver exist
    const [sender, receiver] = await Promise.all([
      userModel.findById(senderId),
      userModel.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).send({ error: 'Sender or receiver not found' });
    }

    // Check if the receiver is already in the sender's friends list
    if (sender.friends.includes(receiverId)) {
      return res.status(400).send({ error: 'You are already friends with this user' });
    }

    // Check if the request has already been sent
    const senderIndex = sender.sentRequests.indexOf(receiverId);
    const receiverIndex = receiver.friendRequests.indexOf(senderId);

    if (senderIndex !== -1 || receiverIndex !== -1) {
      // If the request exists, remove it
      sender.sentRequests.splice(senderIndex, 1);
      receiver.friendRequests.splice(receiverIndex, 1);

      // Save changes to the database
      await Promise.all([sender.save(), receiver.save()]);

      return res.status(200).send({ message: 'Friend request removed successfully' });
    }

    // If the request doesn't exist, send it
    // Initialize arrays if they don't exist
    sender.sentRequests = sender.sentRequests || [];
    receiver.friendRequests = receiver.friendRequests || [];

    // Update sender's sentRequests array
    sender.sentRequests.push(receiverId);
    await sender.save();

    // Update receiver's friendRequests array
    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.status(200).send({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error handling friend request:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});


export const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Authenticate user
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if both sender and receiver exist
    const [sender, receiver] = await Promise.all([
      userModel.findById(senderId),
      userModel.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).send({ error: 'Sender or receiver not found' });
    }

    // Check if the request exists
    const senderIndex = sender.sentRequests.indexOf(receiverId);
    const receiverIndex = receiver.friendRequests.indexOf(senderId);
    
    if (senderIndex === -1 || receiverIndex === -1) {
      // If friend request not found, add or remove based on current state
      if (senderIndex === -1 && receiverIndex === -1) {
        // If neither sent nor received, send friend request
        sender.sentRequests.push(receiverId);
        receiver.friendRequests.push(senderId);
      } else {
        // If already sent or received, remove from friends list
        const friendIndexSender = sender.friends.indexOf(receiverId);
        const friendIndexReceiver = receiver.friends.indexOf(senderId);
        if (friendIndexSender !== -1) sender.friends.splice(friendIndexSender, 1);
        if (friendIndexReceiver !== -1) receiver.friends.splice(friendIndexReceiver, 1);
      }

      // Save changes to the database
      await Promise.all([sender.save(), receiver.save()]);

      return res.status(200).send({ message: 'Friend request status toggled successfully' });
    }

    // If the sender and receiver are not already friends
    if (!sender.friends.includes(receiverId) && !receiver.friends.includes(senderId)) {
      // Remove friend request from sender and receiver
      sender.sentRequests.splice(senderIndex, 1);
      receiver.friendRequests.splice(receiverIndex, 1);

      // Add each other to friends list
      sender.friends.push(receiverId);
      receiver.friends.push(senderId);

      // Save changes to the database
      await Promise.all([sender.save(), receiver.save()]);
    }

    return res.status(200).send({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});


export const getFriendRequests = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    // Authenticate user
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the user
    const user = await userModel.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Get friend requests for the user
    const friendRequests = await userModel.find({ _id: { $in: user.friendRequests } }, {
      firstName: 1,
      lastName: 1,
      phoneNumber: 1,
      address: 1,
      website: 1,
      nickname: 1,
      country: 1,
      city: 1,
      gender: 1,
      relationshipstatus: 1,
      education: 1,
      job: 1,
      purpose: 1,
      interest: 1,
      aboutyourself: 1,
      coverPhoto: 1,
      profilePhoto: 1,
      friends: 1,
      createdAt: 1,
      updatedAt: 1
    });

    res.status(200).json({ friendRequests });
  } catch (error) {
    console.error('Error getting friend requests:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const deleteFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Authenticate user
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if both sender and receiver exist
    const [sender, receiver] = await Promise.all([
      userModel.findById(senderId),
      userModel.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).send({ error: 'Sender or receiver not found' });
    }

    // Check if the request exists
    const senderIndex = sender.sentRequests.indexOf(receiverId);
    const receiverIndex = receiver.friendRequests.indexOf(senderId);

    if (senderIndex === -1 || receiverIndex === -1) {
      return res.status(404).send({ error: 'Friend request not found' });
    }

    // Remove friend request from sender and receiver
    sender.sentRequests.splice(senderIndex, 1);
    receiver.friendRequests.splice(receiverIndex, 1);

    // Save changes to the database
    await Promise.all([sender.save(), receiver.save()]);

    return res.status(200).send({ message: 'Friend request deleted successfully' });
  } catch (error) {
    console.error('Error deleting friend request:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});




export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  // Create a sanitized user object without the password field
  const sanitizedUser = {
    dateOfBirth: user.dateOfBirth,
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    website: user.website,
    nickname: user.nickname,
    country: user.country,
    city: user.city,
    gender: user.gender,
    relationshipstatus: user.relationshipstatus,
    education: user.education,
    job: user.job,
    purpose: user.purpose,
    interest: user.interest,
    aboutyourself: user.aboutyourself,
    coverPhoto: user.coverPhoto,
    profilePhoto: user.profilePhoto,
    followers: user.followers,
    followings: user.followings,
    followRequests: user.followRequests,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    friends: user.friends,
    callTimestamps: user.callTimestamps,
    __v: user.__v,
  };

  res.status(200).send({ userProfile: sanitizedUser });
});


export  const handleBlockUser = asyncHandler(async (req, res) => {
    const { userId, blockedUserId } = req.body;
  
    // Check if both users exist
    const [user, blockedUser] = await Promise.all([
      userModel.findById(userId),
      userModel.findById(blockedUserId),
    ]);
  
    console.log('user:', user);
    console.log('blockedUser:', blockedUser);
  
    if (!user || !blockedUser) {
      return res.status(404).send({ error: 'User or blocked user not found' });
    }
  
    // Check if the user has already blocked the other user
    const isBlocked = user.blockedUsers.includes(blockedUserId);
  
    // Update user's blockedUsers array
    if (!isBlocked) {
      user.blockedUsers.push(blockedUserId);
    } else {
      // If already blocked, unblock the user
      const index = user.blockedUsers.indexOf(blockedUserId);
      user.blockedUsers.splice(index, 1);
    }
  
    await user.save();
  
    res.status(200).send({
      message: isBlocked ? 'User unblocked successfully' : 'User blocked successfully',
    });
  });
  
  export const manageArchive = asyncHandler(async (req, res) => {
    const { userId, itemId, itemType, action } = req.body;
  
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
  
    const validItemTypes = ['stories', 'videos', 'otherItems'];
  
    const cleanedItemType = (itemType || '').toLowerCase().trim();
  
    if (!validItemTypes.includes(cleanedItemType)) {
      return res.status(400).send({ error: 'Invalid item type' });
    }
  
    // Check if the action is valid
    const validActions = ['archive', 'unarchive'];
    if (!validActions.includes(action)) {
      return res.status(400).send({ error: 'Invalid action' });
    }
  
    try {
      const updateQuery = {};
      updateQuery[action === 'archive' ? `$addToSet` : `$pull`] = {
        [`archive.${cleanedItemType}`]: itemId,
      };
  
      const result = await userModel.findByIdAndUpdate(userId, updateQuery, { new: true });
  
      if (!result) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      res.status(200).send({ message: `${action.charAt(0).toUpperCase() + action.slice(1)} successful` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });


  
  export const donationBadge = asyncHandler(async (req, res) => {
    const { userId, newBadge } = req.params; 
    
    try {
      const authenticatedUserId = req.user.user.id;
    
      if (authenticatedUserId !== userId) {
        return res.status(403).send({ error: 'Unauthorized: You are not allowed to update another user\'s donation badge' });
      }
    
      const user = await userModel.findById(userId);
    
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
    
      user.donationBadge = newBadge;
    
      await user.save();
    
      res.status(200).send({ message: 'Donation badge updated successfully', userProfile: user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });