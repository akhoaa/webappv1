import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Permission } from '../permissions/permission.schema';

export type RoleGroupDocument = RoleGroup & Document;

// role-group.schema.ts
@Schema()
export class RoleGroup {
    @Prop({ required: true })
    name: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }])
    permissions: Permission[];
}
export const RoleGroupSchema = SchemaFactory.createForClass(RoleGroup);
