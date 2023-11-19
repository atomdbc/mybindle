import Message from "../model/messages.model.js";
import Group from "../model/groups.model.js";
import asyncHandler from "express-async-handler";

export const createGroup = asyncHandler(async (req, res) => {
    try {
      const { groupName, userId } = req.body;
  
      const existingGroup = await Group.findOne({ name: groupName, createdBy: userId });
  
      if (existingGroup) {
        return res.status(400).json({ success: false, error: 'You already created a group with the same name' });
      }
  
      const group = await Group.create({
        name: groupName,
        members: [userId],
        admins: [userId],
        createdBy: userId,
      });
  
      const io = req.app.get('io');
      await io.to(group._id.toString()).emit('group created', { groupId: group._id.toString(), groupName: group.name, createdBy: userId });
  
      res.json({ success: true, groupId: group._id.toString(), createdBy: userId });
    } catch (error) {
      console.error('Error creating group:', error.message);
      res.status(500).json({ success: false, error: 'Failed to create group' });
    }
  });

  export const deleteGroup = asyncHandler(async (req, res) => {
    try {
      const { groupId, userId } = req.body;
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
      }
  
      const io = req.app.get('io'); 
  
      if (group.admins.includes(userId)) {
        await Group.findByIdAndDelete(groupId);
        io.to(groupId.toString()).emit('group deleted', { groupId });
        res.json({ success: true });
      } else {
        res.status(403).json({ success: false, error: 'You are not the admin of this group' });
      }
    } catch (error) {
      console.error('Error deleting group:', error.message);
      res.status(500).json({ success: false, error: 'Failed to delete group' });
    }
  });
  
  
  

  export const joinGroup = asyncHandler(async (req, res) => {
    try {
      const { groupId, userId } = req.body;
      const group = await Group.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
      }
  
      if (group.members.includes(userId)) {
        return res.status(400).json({ success: false, error: 'User is already a member of the group' });
      }
  
      group.members.push(userId);
      await group.save();
  
      const io = req.app.get('io');
      await io.to(groupId.toString()).emit('user joined', { userId, groupId });
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error joining group:', error.message);
      res.status(500).json({ success: false, error: 'Failed to join group' });
    }
  });
  

  export const leaveGroup = asyncHandler(async (req, res) => {
    try {
      const { groupId, userId } = req.body;
      const group = await Group.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
      }
  
      if (!group.members.includes(userId)) {
        return res.status(400).json({ success: false, error: 'User is not a member of the group' });
      }
  
      const index = group.members.indexOf(userId);
      group.members.splice(index, 1);
      await group.save();
  
      const io = req.app.get('io');
      await io.to(groupId.toString()).emit('user left', { userId, groupId });
      res.json({ success: true });
    } catch (error) {
      console.error('Error leaving group:', error.message);
      res.status(500).json({ success: false, error: 'Failed to leave group' });
    }
  });
  


export const makeGroupadmin = asyncHandler(async (req, res) => {
    try {
      const { groupId, adminUserId, targetUserId } = req.body;
  
      const group = await Group.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ success: false, error: 'Group not found' });
      }
  
      if (!group.admins.includes(adminUserId)) {
        return res.status(403).json({ success: false, error: 'You are not authorized to make others admins' });
      }
  
      if (!group.members.includes(targetUserId)) {
        return res.status(400).json({ success: false, error: 'User is not a member of the group' });
      }
  
      if (!group.admins.includes(targetUserId)) {
        group.admins.push(targetUserId);
        await group.save();
  
        const io = req.app.get('io');
        await io.to(groupId.toString()).emit('admin added', { userId: targetUserId, groupId });
      }
  
      res.json({ success: true, admins: group.admins });
    } catch (error) {
      console.error('Error making user admin:', error.message);
      res.status(500).json({ success: false, error: 'Failed to make user admin' });
    }
    });
  

export const getGroupMessage = asyncHandler(async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const messages = await Message.find({ group: groupId }).sort({ createdAt: 1 });
      res.json({ success: true, messages });
    } catch (error) {
      console.error('Error retrieving messages:', error.message);
      res.status(500).json({ success: false, error: 'Failed to retrieve messages' });
    }
  });
  
export const postGroupMessage = asyncHandler(async (req, res) => {
    try {
      const { groupId, userId, msg } = req.body;
  
      const group = await Group.findById(groupId);
      if (!group || !group.members.includes(userId)) {
        return res.status(403).json({ success: false, error: 'You are not a member of the group' });
      }
  
      const result = await Message.create({ content: msg, sender: userId, group: groupId });
  
      const io = req.app.get('io');
      await io.to(groupId.toString()).emit('chat message', { msg, messageId: result._id, senderId: userId });
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error creating message:', error.message);
      res.status(500).json({ success: false, error: 'Failed to create message' });
    }
  });
  