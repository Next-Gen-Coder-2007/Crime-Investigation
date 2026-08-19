import mongoose, { Document, Schema, Model } from "mongoose";

export type EntityType =
  | "PERSON"
  | "LOCATION"
  | "ORGANIZATION"
  | "VEHICLE"
  | "PHONE"
  | "EMAIL"
  | "WEAPON"
  | "DOCUMENT"
  | "EVENT";

export interface IEntity extends Document {
  caseId: mongoose.Types.ObjectId;
  name: string;
  type: EntityType;
  aliases: string[];
  photoUrl?: string;
  metadata?: Record<string, any>;
  sourceEvidenceIds: mongoose.Types.ObjectId[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EntitySchema = new Schema<IEntity>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: [true, "Case ID is required"],
    },
    name: {
      type: String,
      required: [true, "Entity name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "PERSON",
        "LOCATION",
        "ORGANIZATION",
        "VEHICLE",
        "PHONE",
        "EMAIL",
        "WEAPON",
        "DOCUMENT",
        "EVENT",
      ],
      required: [true, "Entity type is required"],
    },
    aliases: [
      {
        type: String,
        trim: true,
      },
    ],
    photoUrl: {
      type: String,
      default: "",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    sourceEvidenceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Evidence",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Entity: Model<IEntity> =
  mongoose.models.Entity || mongoose.model<IEntity>("Entity", EntitySchema);
