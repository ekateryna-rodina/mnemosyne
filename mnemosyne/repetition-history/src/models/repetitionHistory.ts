import { RepetitionResult } from "@meproj/common";
import mongoose from "mongoose";
interface RepetitionHistoryAttrs {
  repetitionId: string;
  userId: string;
  cardId: string;
  card: string;
  version: number;
  result?: RepetitionResult;
  totalAttempts: number;
  successfullAttempts: number;
}

export interface RepetitionHistoryDocument extends mongoose.Document {
  repetitionId: string;
  userId: string;
  cardId: string;
  card: string;
  version: number;
  result?: RepetitionResult;
  totalAttempts: number;
  successfullAttempts: number;
  createdAt: string;
  updatedAt: string;
}

interface RepetitionHistoryModel
  extends mongoose.Model<RepetitionHistoryDocument> {
  build(attr: RepetitionHistoryAttrs): RepetitionHistoryDocument;
}

const repetitionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    repetitionId: {
      type: String,
      required: true,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    successfullAttempts: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: mongoose.Schema.Types.Date,
    },
    updatedAt: {
      type: mongoose.Schema.Types.Date,
    },
    cardId: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    result: {
      type: RepetitionResult,
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

repetitionHistorySchema.statics.build = (attr: RepetitionHistoryAttrs) => {
  return new RepetitionHistory(attr);
};

const RepetitionHistory = mongoose.model<
  RepetitionHistoryDocument,
  RepetitionHistoryModel
>("RepetitionHistory", repetitionHistorySchema);

export { RepetitionHistory };
