import { Schema, model, models, PaginateModel, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const UserSchema = new Schema(
  {
    address: {
      type: String,
      unique: true,
      index: true,
    },
    nickname: String,
    slashie: String,
    avatar: String,
    cover: String,
    bio: String,
    email: { type: String },
    website: String,
    twitter: String,
    github: String,
    views: { type: Number, default: 0, index: true },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    locked: {
      type: Boolean,
      default: false,
      index: true,
    },
    score: { type: Number, default: 0, index: true },
    createdAt: { type: Date, default: () => new Date(), index: true },
    updatedAt: { type: Date, default: () => new Date() },
  },
  {
    collection: 'User',
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

UserSchema.plugin(paginate);

export interface UserDocument extends Document {
  address: string;
  nickname: string;
  slashie: string;
  avatar: string;
  cover: string;
  bio: string;
  email: string;
  twitter: string;
  github: string;
  website: string;
  skills: string[];
  roles: string[];
  interests: string[];
  external: {
    cyberConnect: {
      followAddress: string;
      upvoteAddress: string;
    };
  };
  locked: boolean;
}

const User: PaginateModel<UserDocument> =
  (models.User as PaginateModel<UserDocument>) ||
  model<UserDocument, PaginateModel<UserDocument>>('User', UserSchema);

export default User;
