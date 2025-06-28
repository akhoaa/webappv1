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

    async findByIdWithRole(userId: string) {
        return await this.userModel
            .findById(userId)
            .populate({
                path: 'roleGroup',
                populate: {
                    path: 'permissions',
                    model: 'Permission'
                }
            })
            .exec();
    }

    // Alternative method if the above doesn't work with your schema
    async findByIdWithRoleAlternative(userId: string) {
        const user = await this.userModel.findById(userId).populate('roleGroup').exec();

        if (!user || !user.roleGroup) {
            return user;
        }

        // If permissions are stored as ObjectIds in roleGroup, populate them
        const populatedUser = await this.userModel
            .findById(userId)
            .populate({
                path: 'roleGroup',
                populate: {
                    path: 'permissions'
                }
            })
            .exec();

        return populatedUser;
    }
}

