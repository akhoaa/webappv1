import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from '../users/user.schema';

export type ProjectDocument = Project & Document;

export enum ProjectStatus {
    PLANNING = 'planning',
    IN_PROGRESS = 'in_progress',
    ON_HOLD = 'on_hold',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class Project {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.PLANNING })
    status: ProjectStatus;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: User;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
    members: User[];

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ default: 0 })
    progress: number; // 0-100

    @Prop({ default: 0 })
    totalTasks: number;

    @Prop({ default: 0 })
    completedTasks: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
