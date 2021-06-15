import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
// interface to describe properties of a follower entity

export interface IFollower {
  id: string;
  username: string;
  followersIds?: string[];
  followingIds?: string[];
}

export interface FollowerDocument extends mongoose.Document {
  username: string;
  followersIds?: string[];
  followingIds?: string[];
  version: number;
}

interface FollowerModel extends mongoose.Model<FollowerDocument> {
  build(attr: IFollower): FollowerDocument;
}

const followerSchema = new mongoose.Schema(
  {
    username: {
      type: "string",
      required: true,
    },
    followersIds: {
      type: [{ type: String, required: false }],
    },
    followingIds: {
      type: [{ type: String, required: false }],
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Follower" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Follower" }],
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
followerSchema.set("versionKey", "version");
followerSchema.plugin(updateIfCurrentPlugin);
followerSchema.statics.build = (attr: IFollower) => {
  return new Follower({
    _id: attr.id,
    ...attr,
  });
};

const Follower = mongoose.model<FollowerDocument, FollowerModel>(
  "Follower",
  followerSchema
);
export { Follower };
