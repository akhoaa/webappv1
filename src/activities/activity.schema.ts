import { Project } from '@/projects/project.schema';
import { Task } from '@/tasks/task.schema';
import { User } from '@/users/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type ActivityDocument = Activity & Document;

export enum ActivityType {
    TASK_CREATED = 'task_created',
    TASK_UPDATED = 'task_updated',
    TASK_STATUS_CHANGED = 'task_status_changed',
    TASK_ASSIGNED = 'task_assigned',
    COMMENT_ADDED = 'comment_added',
    PROJECT_CREATED = 'project_created',
    USER_JOINED = 'user_joined'
}

@Schema({ timestamps: true })
export class Activity {
    @Prop({ type: String, enum: ActivityType, required: true })
    type: ActivityType;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
    project: Project;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
    task: Task;

    @Prop()
    description: string;

    @Prop({ type: Object })
    metadata: any; // For storing additional data like old/new values
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);