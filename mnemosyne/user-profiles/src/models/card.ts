import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface ICard {
  id: string;
  phrase: string;
  image?: string;
  userId: string;
  tags: string[];
}

export interface CardDocument extends mongoose.Document {
  id: string;
  phrase: string;
  image?: string;
  userId: string;
  tags: string[];
  version: number;
}

interface CardModel extends mongoose.Model<CardDocument> {
  build(attr: ICard): CardDocument;
  findByIdAndPreVersion(event: {
    id: string;
    version: number;
  }): Promise<CardDocument | null>;
}

const cardSchema = new mongoose.Schema(
  {
    phrase: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    image: {
      type: Number,
    },
    tags: {
      type: [{ type: String }],
      required: true,
    },
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
cardSchema.set("versionKey", "version");
cardSchema.plugin(updateIfCurrentPlugin);
cardSchema.statics.build = (attr: ICard) => {
  return new Card({
    _id: mongoose.Types.ObjectId(attr.id),
    ...attr,
  });
};
cardSchema.statics.findByIdAndPreVersion = async (event) => {
  const { id, version } = event;
  return await Card.findOne({
    _id: mongoose.Types.ObjectId(id),
    version: version - 1,
  });
};
const Card = mongoose.model<CardDocument, CardModel>("Card", cardSchema);
export { Card };
