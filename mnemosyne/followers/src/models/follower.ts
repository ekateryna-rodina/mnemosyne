import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
// interface to describe properties of a follower entity

export interface IFollower {
  id: string;
  username: string;
  followers?: string[];
  following?: string[];
}

export interface FollowerDocument extends mongoose.Document {
  username: string;
  followers?: string[];
  following?: string[];
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
    followers: {
      type: [{ type: String }],
    },
    following: {
      type: [{ type: String }],
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
