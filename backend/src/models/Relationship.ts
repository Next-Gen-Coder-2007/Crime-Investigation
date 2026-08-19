import mongoose, { Document, Schema, Model } from "mongoose";

export type RelationshipPredicate =
  | "KNOWS"
  | "LOCATED_AT"
  | "MENTIONED_IN"
  | "RELATED_TO"
  | "OCCURRED_AT"
  | "OWNED_BY"
  | "PART_OF"
  | "MET_WITH"
  | "COMMUNICATED_WITH"
  | "SUSPECT_IN";

export type LinkReviewStatus = "pending" | "accepted" | "rejected";

export interface IRelationship extends Document {
  caseId: mongoose.Types.ObjectId;
  sourceEntityId: mongoose.Types.ObjectId;
  targetEntityId: mongoose.Types.ObjectId;
  predicate: RelationshipPredicate;
  confidence: number;
  sourceEvidenceIds: mongoose.Types.ObjectId[];
  reviewStatus: LinkReviewStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RelationshipSchema = new Schema<IRelationship>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: [true, "Case ID is required"],
    },
    sourceEntityId: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
      required: [true, "Source entity is required"],
    },
    targetEntityId: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
      required: [true, "Target entity is required"],
    },
    predicate: {
      type: String,
      required: [true, "Predicate relationship type is required"],
      enum: [
        "KNOWS",
        "LOCATED_AT",
        "MENTIONED_IN",
        "RELATED_TO",
        "OCCURRED_AT",
        "OWNED_BY",
        "PART_OF",
        "MET_WITH",
        "COMMUNICATED_WITH",
        "SUSPECT_IN",
      ],
      default: "RELATED_TO",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    sourceEvidenceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Evidence",
      },
    ],
    reviewStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "accepted",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Relationship: Model<IRelationship> =
  mongoose.models.Relationship ||
  mongoose.model<IRelationship>("Relationship", RelationshipSchema);
