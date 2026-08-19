import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITimelineEvent extends Document {
  caseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  timestamp: Date;
  location?: string;
  sourceEvidenceIds: mongoose.Types.ObjectId[];
  entityIds: mongoose.Types.ObjectId[];
  isConflict: boolean;
  conflictDetails?: string;
  isAiGenerated: boolean;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema = new Schema<ITimelineEvent>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: [true, "Case ID is required"],
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      required: [true, "Event timestamp is required"],
    },
    location: {
      type: String,
      default: "",
    },
    sourceEvidenceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Evidence",
      },
    ],
    entityIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entity",
      },
    ],
    isConflict: {
      type: Boolean,
      default: false,
    },
    conflictDetails: {
      type: String,
      default: "",
    },
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
    confidence: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const TimelineEvent: Model<ITimelineEvent> =
  mongoose.models.TimelineEvent ||
  mongoose.model<ITimelineEvent>("TimelineEvent", TimelineEventSchema);
