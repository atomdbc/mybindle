import mongoose from "mongoose";

export const pageSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: [true, 'Please provide a title']
    },
    slug: {
        type: String,
        required: [true, 'Please provide Slug']
    },
    public: {
        type: Boolean,
        required: [true, "Please Public fied is require"]
    },
    members: {
        type:[mongoose.Schema.Types.ObjectId],
        default: []
    },
    Age_restiction: {
        type: Number,
        default: 0,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Admin Id is required, which is the id of the user creating the page"]
    },
    moderators_edit: {
        type: Boolean,
        default: false,
    },
    moderators: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    profile_picture: {
        type: String,
        default: null
    },
    cover_picture: {
        type: String,
        default: null
    },
    desc: {
        type: String,
        required: [true, "Description is required"]
    },
    joining_questions: {
        type: Array,
        default: []
    },
    posts: {
        type: Array,
        default: null,
    }, 
    phone: {
      type: String,
      // unique: [true, "Phone Number Already Exists"],
      default: null
    },
    website: {
      type: Array,
      default: [],
    },
    purpose: {
      type: String,
      default: null
    },
    kind: {
      type: String,
      default: null
    },
    followers : {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },

    joining_questions: {
      type: [
        {
          text: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId], // Define as an array of ObjectId values.
        default: [], // Set a default value as an empty array.
      },
    views: {
        type: Number,
        default: 0,
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
    
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Page", pageSchema);

