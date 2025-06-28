import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from '../users/user.schema';
import { Project } from '../projects/project.schema';

export type TaskDocument = Task & Document;

export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    IN_REVIEW = 'in_review',
    COMPLETED = 'completed',
    BLOCKED = 'blocked'
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    assignee: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    createdBy: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true })
    project: Project;

    @Prop()
    dueDate: Date;

    @Prop({ default: 0 })
    estimatedHours: number;

    @Prop({ default: 0 })
    actualHours: number;

    @Prop([String])
    tags: string[];

    @Prop({ default: 0 })
    progress: number; // 0-100

    // Analytics fields
    @Prop()
    startedAt: Date;

    @Prop()
    completedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Add indexes for performance
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assignee: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });