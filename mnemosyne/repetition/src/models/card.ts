import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface IKeyword {
  question?: string;
  answer: string;
  options?: string[] | number[];
}
export interface ICard {
  id: string;
  phrase: string;
  keywords: {
    question?: string;
    answer: string;
    options?: string[] | number[];
  }[];
  image?: string;
  userId: string;
  isPriority?: boolean;
  tags: string[];
  version: number;
}

export interface CardDocument extends mongoose.Document {
  phrase: string;
  keywords: {
    question?: string;
    answer: string;
    options?: string[] | number[];
  }[];
  image?: string;
  userId: string;
  isPriority: boolean;
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

const keywordsSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String, required: true },
  options: { type: [String], default: [] },
});
const cardSchema = new mongoose.Schema(
  {
    phrase: {
      type: String,
      required: true,
    },
    keywords: {
      type: [keywordsSchema],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    isPriority: {
      type: Boolean,
      default: false,
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
  const noversionall = await Card.find({});
  return await Card.findOne({
    _id: mongoose.Types.ObjectId(id),
    version: version - 1,
  });
};
const Card = mongoose.model<CardDocument, CardModel>("Card", cardSchema);
export { Card };
