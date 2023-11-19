import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
