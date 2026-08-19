import mongoose, { Document, Schema, Model } from "mongoose";

export interface IBoardNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface IBoardEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  data?: Record<string, any>;
}

export interface IBoard extends Document {
  caseId: mongoose.Types.ObjectId;
  nodes: IBoardNode[];
  edges: IBoardEdge[];
  lastUpdatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: [true, "Case reference is required"],
      unique: true,
    },
    nodes: {
      type: [
        {
          id: { type: String, required: true },
          type: { type: String, default: "custom" },
          position: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
          },
          data: { type: Schema.Types.Mixed, default: {} },
        },
      ],
      default: [],
    },
    edges: {
      type: [
        {
          id: { type: String, required: true },
          source: { type: String, required: true },
          target: { type: String, required: true },
          label: { type: String, default: "" },
          type: { type: String, default: "default" },
          data: { type: Schema.Types.Mixed, default: {} },
        },
      ],
      default: [],
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Board: Model<IBoard> =
  mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);
