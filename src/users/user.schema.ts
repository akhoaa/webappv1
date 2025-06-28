import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
// Adjust the import path as needed based on your project structure
import { RoleGroup } from '../roles/rolegroup.schema';
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;


    @Prop()
    resetToken?: string;

    @Prop()
    resetTokenExpires?: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RoleGroup' })
    roleGroup: RoleGroup;
}

export const UserSchema = SchemaFactory.createForClass(User);
