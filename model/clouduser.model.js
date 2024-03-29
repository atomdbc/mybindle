import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserCloudSchema = new Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cloudId: { type: Number, required: true },
    userName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    subdomain: { type: String, required: true },
    activePlan: { 
        type: String, 
        required: true, 
        default: 'free', 
        enum: ['free', '5', '50', '500']
    }
});

const UserCloud = mongoose.model('UserCloud', UserCloudSchema);

export default UserCloud;