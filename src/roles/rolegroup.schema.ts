import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Permission } from '../permissions/permission.schema';

export type RoleGroupDocument = RoleGroup & Document;

@Schema({ timestamps: true })
export class RoleGroup {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
        default: [],
    })
    permissions: Permission[];
}

export const RoleGroupSchema = SchemaFactory.createForClass(RoleGroup);
