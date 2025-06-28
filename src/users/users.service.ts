import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(data: Partial<User>): Promise<User> {
        try {
            return await this.userModel.create(data);
        } catch (error) {
            console.error(' Error creating user:', error.message);
            throw error;
        }
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email });
    }

    findByResetToken(token: string) {
        return this.userModel.findOne({ resetToken: token });
    }

    async assignRoleGroup(userId: string, roleGroupId: string) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { roleGroup: roleGroupId },
            { new: true },
        ).populate('roleGroup');

        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findByEmailWithPermissions(email: string) {
        return this.userModel
            .findOne({ email })
            .select('+password')
            .populate({
                path: 'roleGroup',
                populate: { path: 'permissions' },
            });
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().populate('roleGroup', 'name');
    }

}
