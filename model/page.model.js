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
        required: [true, "Please Public field is required"]
    },
    members: {
        type:[mongoose.Schema.Types.ObjectId],
        default: []
    },
    ageRestriction: { // Changed Age_restiction to camelCase
        type: Number,
        default: 0,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Admin Id is required, which is the id of the user creating the page"]
    },
    moderatorsEdit: { // Changed moderators_edit to camelCase
        type: Boolean,
        default: false,
    },
    moderators: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    profilePicture: { // Changed profile_picture to camelCase
        type: String,
        default: null
    },
    coverPicture: { // Changed cover_picture to camelCase
        type: String,
        default: null
    },
    description: { // Changed desc to camelCase
        type: String,
        required: [true, "Description is required"]
    },
    joiningQuestions: { // Changed joining_questions to camelCase
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
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joiningQuestions: {
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
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
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
