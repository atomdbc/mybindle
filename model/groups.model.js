import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  muted: { type: Boolean, default: false },
}, { _id: false });

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  coverPhoto: { type: String, required: true, match: /^(http|https):\/\// },
  pagePhoto: { type: String, required: true, match: /^(http|https):\/\// },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  anyoneCanJoin: { type: Boolean, default: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
  // Additional Fields for Messaging
  lastActivity: { type: Date, default: null }, // Track the timestamp of the group's last activity
  unreadCount: { type: Number, default: 0 },
  mutedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

export default Group;
