import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  friendTags: [{ type: mongoose.Schema.Types.ObjectId }],
  shareWithGroups: [{ type: mongoose.Schema.Types.ObjectId }],
  shareWithPages: [{ type: mongoose.Schema.Types.ObjectId }],
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  location: { type: String, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
{
  timestamps: true,
});

const Story = mongoose.model('Story', storySchema);

export default Story;
