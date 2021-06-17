import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface IUserCardInfo {
  userId: string;
  img?: string;
  username: string;
}
export interface IFollower {
  userId: string;
  following: IUserCardInfo[];
}

export interface FollowerDocument extends mongoose.Document {
  userId: string;
  following: IUserCardInfo[];
}

interface FollowerModel extends mongoose.Model<FollowerDocument> {
  build(attr: IFollower): FollowerDocument;
}

const userCardInfoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  img: { type: String, required: false },
});
const followerSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    following: { type: [userCardInfoSchema], default: [] },
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
  return new Follower(attr);
};

const Follower = mongoose.model<FollowerDocument, FollowerModel>(
  "Follower",
  followerSchema
);
export { Follower };
