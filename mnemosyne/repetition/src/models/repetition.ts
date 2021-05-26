import { RepetitionStatus } from "@meproj/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { CardDocument } from "./card";
interface RepetitionAttrs {
  userId: string;
  cardId: string;
  card: string;
  version: number;
  result?: "success" | "failure";
}

export interface RepetitionDocument extends mongoose.Document {
  userId: string;
  status: RepetitionStatus;
  interval: number;
  totalAttempts: number;
  successfullAttempts: number;
  card: CardDocument;
  cardId: string;
  createdAt: string;
  updatedAt: string;
  nextRepetition: string;
  isArchived: boolean;
}

interface RepetitionModel extends mongoose.Model<RepetitionDocument> {
  build(attr: RepetitionAttrs): RepetitionDocument;
  findByIdAndPreVersion(event: {
    cardId: string;
    version: number;
  }): Promise<RepetitionDocument | null>;
}

const repetitionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: RepetitionStatus.Pending,
      enum: Object.keys(RepetitionStatus),
    },
    interval: {
      type: Number,
      required: true,
      default: 24,
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
    nextRepetition: {
      type: mongoose.Schema.Types.Date,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    cardId: {
      type: String,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
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
repetitionSchema.set("versionKey", "version");
repetitionSchema.plugin(updateIfCurrentPlugin);
repetitionSchema.statics.build = (attr: RepetitionAttrs) => {
  return new Repetition(attr);
};
repetitionSchema.statics.findByIdAndPreVersion = async (event) => {
  const { cardId, version } = event;
  const repetition = await Repetition.findOne({ cardId, version: version - 1 });
  return repetition;
};
const Repetition = mongoose.model<RepetitionDocument, RepetitionModel>(
  "Repetition",
  repetitionSchema
);

export { Repetition };
