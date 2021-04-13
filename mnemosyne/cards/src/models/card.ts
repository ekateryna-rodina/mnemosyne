import mongoose from "mongoose";
// interface to describe properties of a card

interface IKeyword {
  question?: string;
  answer: string;
  options?: string[] | number[];
}
export interface ICard {
  phrase: string;
  keywords: {
    question?: string;
    answer: string;
    options?: string[] | number[];
  }[];
  tags: string[];
  image?: string;
  deckId?: string;
  referenceCards?: string[];
  userId: string;
  isPublic?: boolean;
}

export interface CardDocument extends mongoose.Document {
  phrase: string;
  keywords: {
    question?: string;
    answer: string;
    options?: string[] | number[];
  }[];
  tags: string[];
  image?: string;
  deckId?: string;
  referenceCards?: string[];
  userId: string;
  isPublic?: boolean;
  createdAt: string;
}

interface CardModel extends mongoose.Model<CardDocument> {
  build(attr: ICard): CardDocument;
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
    tags: {
      type: [{ type: String }],
      required: true,
    },
    image: {
      type: Number,
    },
    deckId: {
      type: String,
    },
    referenceCards: {
      type: [String],
    },
    isPublic: {
      type: Boolean,
      default: false,
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

cardSchema.statics.build = (attr: ICard) => {
  return new Card(attr);
};
const Card = mongoose.model<CardDocument, CardModel>("Card", cardSchema);
export { Card };

// move to a separate service
// trainingInfo?: {
//   totalAttemps: number;
//   success: number;
//   lastUpdate: string;
//   inQueue: boolean;
//   recentlyFailed: boolean;
// };
