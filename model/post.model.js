import mongoose from "mongoose";

export const postSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: [true, "Please provide a description"],
    },
    photo: {
      type: String,
      default: null,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    comments: [
      {
        text: {
          type: String,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: String,
      default: null,
    },
    friendTags: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    sharewithgroups: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    sharewithpages: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    isStory: {
      type: Boolean,
      default: false,
    },
    storyExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
