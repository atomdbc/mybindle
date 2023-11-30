import  Group  from '../model/groups.model.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

export const createGroup = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug: customSlug,
      phone,
      website,
      purpose,
      visibility,
      description,
      coverPhoto,
      pagePhoto,
      anyoneCanJoin,
      userId,
    } = req.body;

    let slug = customSlug || slugify(name, { lower: true });

    const existingGroup = await Group.findOne({ name, createdBy: userId });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        error: 'You already created a group with the same name',
      });
    }

    const existingSlug = await Group.findOne({ slug });

    if (existingSlug) {
      const uniqueSlug = `${slug}-${Date.now().toString(36).substring(2, 8)}`;
      slug = uniqueSlug;
    }

    const group = await Group.create({
      name,
      slug,
      phone,
      website,
      purpose,
      visibility,
      description,
      coverPhoto,
      pagePhoto,
      anyoneCanJoin,
      createdBy: userId,
      admins: [userId], // Only add the creator to the admins array
    });

    res.json({
      success: true,
      groupId: group._id.toString(),
      createdBy: userId,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create group',
    });
  }
});



export const updateGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, updates } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Update only the allowed fields based on your model
    const allowedFields = [
      'name',
      'slug',
      'phone',
      'website',
      'purpose',
      'visibility',
      'description',
      'coverPhoto',
      'pagePhoto',
      'anyoneCanJoin',
    ];

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        group[key] = updates[key];
      }
    });

    await group.save();

    res.json({ success: true, updatedGroup: group });
  } catch (error) {
    console.error('Error updating group:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update group' });
  }
});
// {
//   "groupId": "656669f1cad9fed6f93f87c8", 
//   "updates": {
//     "name": "Updated Group Name",
//     "description": "Updated Group Description",
//     "coverPhoto": "https://example.com/updated-cover.jpg"
//   }
// }


export const deleteGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
      return res.status(400).json({ success: false, error: 'Invalid input data' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    if (group.admins && group.admins.includes(userId)) {
      await Group.findByIdAndDelete(groupId);
      res.json({ success: true, message: 'Group deleted successfully' });
    } else {
      res.status(403).json({ success: false, error: 'You are not the admin of this group' });
    }
  } catch (error) {
    console.error('Error deleting group:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid group ID format' });
    }

    res.status(500).json({ success: false, error: 'Failed to delete group' });
  }
});



export const joinGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userIds } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Ensure that group.members is an array or initialize it as an empty array
    const existingMembers = group.members || [];

    // Check if any of the provided users are already members
    const existingUsers = existingMembers.filter((member) => userIds.includes(member.userId.toString()));

    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, error: 'One or more users are already members of the group' });
    }

    // Add the new users to the group members
    const newMembers = userIds.map(userId => ({ userId }));
    group.members = existingMembers.concat(newMembers);

    await group.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error joining group:', error.message);
    res.status(500).json({ success: false, error: 'Failed to join group' });
  }
});

// {
//   "groupId": "65666db358c2b7b7850b73c3",
//   "userIds": ["654a7bfeb5b60816c3e96ad7"]
// }

export const leaveGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Check if the user is a member of the group
    const isMember = group.members.some((member) => member.userId.toString() === userId);

    if (!isMember) {
      return res.status(400).json({ success: false, error: 'User is not a member of the group' });
    }

    // Remove the user from the group members
    const updatedMembers = group.members.filter((member) => member.userId.toString() !== userId);
    group.members = updatedMembers;

    await group.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error leaving group:', error.message);
    res.status(500).json({ success: false, error: 'Failed to leave group' });
  }
});

// {
//   "groupId": "65666db358c2b7b7850b73c3",
//   "userId": "654a7bfeb5b60816c3e96ad7"
// }

export const getGroupAdmins = asyncHandler(async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Extract admin IDs directly
    const admins = group.admins.map(admin => admin._id);

    res.json({ success: true, admins });
  } catch (error) {
    console.error('Error getting group admins:', error.message);
    res.status(500).json({ success: false, error: 'Failed to get group admins' });
  }
});







export const makeGroupAdmin = asyncHandler(async (req, res) => {
  try {
    const { groupId, adminUserId, targetUserId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    if (!group.admins.includes(adminUserId)) {
      return res.status(403).json({ success: false, error: 'You are not authorized to make others admins' });
    }

    if (!group.members.some(member => member.userId.toString() === targetUserId)) {
      return res.status(400).json({ success: false, error: 'User is not a member of the group' });
    }

    if (!group.admins.includes(targetUserId)) {
      group.admins.push(targetUserId);
      await group.save();
    }

    const admins = group.admins.map(admin => admin.toString());

    res.json({ success: true, admins });
  } catch (error) {
    console.error('Error making user admin:', error.message);
    res.status(500).json({ success: false, error: 'Failed to make user admin' });
  }
});

export const getGroups = asyncHandler(async (req, res) => {
  try {
    const groups = await Group.find();
    res.json({ success: true, groups });
  } catch (error) {
    console.error('Error getting groups:', error.message);
    res.status(500).json({ success: false, error: 'Failed to get groups' });
  }
});

const existingSlugs = [];


export const generateSlug = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    const baseSlug = slugify(name, { lower: true });

    let finalSlug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    existingSlugs.push(finalSlug);

    res.json({ success: true, slug: finalSlug });
  } catch (error) {
    console.error('Error generating slug:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate slug' });
  }
});

export const toggleMuteStatus = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    // Find the group
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Find the member in the group
    const member = group.members.find(member => member.userId.toString() === userId);

    if (!member) {
      return res.status(400).json({ success: false, error: 'User is not a member of the group' });
    }

    // Toggle mute status
    member.muted = !member.muted;

    // Save the changes to the group
    await group.save();

    res.json({ success: true, muted: member.muted });
  } catch (error) {
    console.error('Error toggling mute status:', error.message);
    res.status(500).json({ success: false, error: 'Failed to toggle mute status' });
  }
});