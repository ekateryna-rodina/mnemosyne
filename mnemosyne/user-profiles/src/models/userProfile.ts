import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ICard } from "./card";

export interface IUserProfile {
  id: string;
  image?: string;
  username: string;
  followers?: [mongoose.Schema.Types.ObjectId];
  following?: [mongoose.Schema.Types.ObjectId];
  cards?: ICard[];
  tags?: string[];
}

export interface UserProfileDocument extends mongoose.Document {
  id: string;
  image?: string;
  username: string;
  followers?: [mongoose.Schema.Types.ObjectId];
  following?: [mongoose.Schema.Types.ObjectId];
  cards?: ICard[];
  tags?: string[];
  version: number;
}

interface UserProfileModel extends mongoose.Model<UserProfileDocument> {
  build(attr: IUserProfile): UserProfileDocument;
  findByIdAndPreVersion(event: {
    id: string;
    version: number;
  }): Promise<UserProfileDocument | null>;
}

const userProfileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    tags: {
      type: [{ type: String }],
      required: true,
      default: [],
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }],
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    version: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
userProfileSchema.set("versionKey", "version");
userProfileSchema.plugin(updateIfCurrentPlugin);
userProfileSchema.statics.build = (attr: IUserProfile) => {
  return new UserProfile({
    _id: mongoose.Types.ObjectId(attr.id),
    ...attr,
  });
};
userProfileSchema.statics.findByIdAndPreVersion = async (event: any) => {
  const { id, version } = event;
  return await UserProfile.findOne({
    _id: mongoose.Types.ObjectId(id),
    version: version - 1,
  });
};
const UserProfile = mongoose.model<UserProfileDocument, UserProfileModel>(
  "UserProfile",
  userProfileSchema
);
export { UserProfile };
