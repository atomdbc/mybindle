import asyncHandler from 'express-async-handler';
import userModel from '../model/user.model.js'; // Adjust the path based on your project structure

// Controller to handle sending and removing friend requests
export const handleFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  // Check if both sender and receiver exist
  const [sender, receiver] = await Promise.all([
    userModel.findById(senderId),
    userModel.findById(receiverId),
  ]);

  if (!sender || !receiver) {
    return res.status(404).send({ error: 'Sender or receiver not found' });
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
  
    // Check if the item type is valid
    const validItemTypes = ['stories', 'videos', 'otherItems'];
  
    // Ensure itemType is defined and not an empty string
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