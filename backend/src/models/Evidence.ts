import mongoose, { Document, Schema, Model } from "mongoose";

export type EvidenceType =
  | "document"
  | "image"
  | "audio"
  | "video"
  | "financial"
  | "interview"
  | "location"
  | "note";

export type ReviewPriority = "low" | "medium" | "high";
export type ReviewStatus = "pending" | "approved" | "rejected";

export interface IEvidence extends Document {
  caseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: EvidenceType;
  fileUrl?: string;
  fileHash?: string;
  uploadedBy: mongoose.Types.ObjectId;
  timestamp: Date;
  location?: string;
  tags: string[];
  rawText?: string;
  aiSummary?: string;
  aiConfidence?: number;
  reviewPriority: ReviewPriority;
  reviewStatus: ReviewStatus;
  entities: mongoose.Types.ObjectId[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const EvidenceSchema = new Schema<IEvidence>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: [true, "Case reference is required"],
    },
    title: {
      type: String,
      required: [true, "Evidence title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: [
        "document",
        "image",
        "audio",
        "video",
        "financial",
        "interview",
        "location",
        "note",
      ],
      default: "document",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    fileHash: {
      type: String,
      default: "",
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader user reference is required"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    rawText: {
      type: String,
      default: "",
    },
    aiSummary: {
      type: String,
      default: "",
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    reviewPriority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    entities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entity",
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Evidence: Model<IEvidence> =
  mongoose.models.Evidence || mongoose.model<IEvidence>("Evidence", EvidenceSchema);
