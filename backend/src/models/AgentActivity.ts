import mongoose, { Document, Schema } from 'mongoose';

export interface IAgentActivity extends Document {
  userId: mongoose.Types.ObjectId;
  agent_name: string;
  agent_type: string;
  action: string;
  status: 'success' | 'failed' | 'running' | 'idle';
  details?: string;
  execution_time_ms: number;
  createdAt: Date;
}

const AgentActivitySchema = new Schema<IAgentActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    agent_name: { type: String, required: true },
    agent_type: { type: String, required: true },
    action: { type: String, required: true },
    status: {
      type: String,
      enum: ['success', 'failed', 'running', 'idle'],
      default: 'success',
    },
    details: { type: String },
    execution_time_ms: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const AgentActivity = mongoose.model<IAgentActivity>('AgentActivity', AgentActivitySchema);
