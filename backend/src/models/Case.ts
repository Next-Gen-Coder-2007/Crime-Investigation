import mongoose, { Document, Schema, Model } from "mongoose";

export type CaseStatus = "new" | "active" | "under_investigation" | "review" | "closed";
export type CasePriority = "low" | "medium" | "high" | "critical";
export type AccessRequestStatus = "pending" | "approved" | "rejected";

export interface IAccessRequest {
  _id?: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userBadge: string;
  userEmail: string;
  requestedAt: Date;
  status: AccessRequestStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
}

export interface ICollaborator {
  userId: mongoose.Types.ObjectId;
  name: string;
  badgeNumber: string;
  role: string;
  joinedAt: Date;
}

export interface ICase extends Document {
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  category: string;
  leadInvestigator: mongoose.Types.ObjectId;
  assignedMembers: mongoose.Types.ObjectId[];
  collaborators: ICollaborator[];
  accessRequests: IAccessRequest[];
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

const AccessRequestSchema = new Schema<IAccessRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userBadge: { type: String, required: true },
    userEmail: { type: String, default: "" },
    requestedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedBy: { type: String, default: "" },
    reviewedAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { _id: true }
);

const CollaboratorSchema = new Schema<ICollaborator>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    badgeNumber: { type: String, required: true },
    role: { type: String, default: "investigator" },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

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
    collaborators: [CollaboratorSchema],
    accessRequests: [AccessRequestSchema],
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
