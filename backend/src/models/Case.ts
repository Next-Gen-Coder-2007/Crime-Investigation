import mongoose, { Document, Schema, Model } from "mongoose";

export type CaseStatus = "new" | "active" | "under_investigation" | "review" | "closed";
export type CasePriority = "low" | "medium" | "high" | "critical";

export interface ICase extends Document {
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  category: string;
  leadInvestigator: mongoose.Types.ObjectId;
  assignedMembers: mongoose.Types.ObjectId[];
  tags: string[];
  location?: string;
  deadline?: Date;
  metrics: {
    evidenceCount: number;
    entityCount: number;
    timelineCount: number;
    taskCount: number;
    riskScore: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
  {
    caseNumber: {
      type: String,
      required: [true, "Case number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, "Case title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "active", "under_investigation", "review", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    category: {
      type: String,
      default: "General Crime",
      trim: true,
    },
    leadInvestigator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Lead investigator is required"],
    },
    assignedMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      default: "",
    },
    deadline: {
      type: Date,
    },
    metrics: {
      evidenceCount: { type: Number, default: 0 },
      entityCount: { type: Number, default: 0 },
      timelineCount: { type: Number, default: 0 },
      taskCount: { type: Number, default: 0 },
      riskScore: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const Case: Model<ICase> = mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);
