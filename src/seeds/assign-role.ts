
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/user.schema';
import { RoleGroup } from '../roles/rolegroup.schema';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userModel = app.get<Model<User>>(getModelToken(User.name));
    const roleGroupModel = app.get<Model<RoleGroup>>(getModelToken(RoleGroup.name));

    // 🔥 CHANGE THIS TO YOUR USER'S EMAIL
    const userEmail = 'owner@gmail.com'; // ← Change this!
    const roleName = 'Owner'; // or 'Staff'

    try {
        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            Logger.error(`❌ User with email ${userEmail} not found`);
            await app.close();
            return;
        }

        const roleGroup = await roleGroupModel.findOne({ name: roleName });
        if (!roleGroup) {
            Logger.error(`❌ Role group ${roleName} not found`);
            await app.close();
            return;
        }

        user.roleGroup = roleGroup._id as any;
        await user.save();

        Logger.log(`✅ Assigned role '${roleName}' to user '${userEmail}'`);

        // Verify the assignment
        const updatedUser = await userModel.findOne({ email: userEmail }).populate('roleGroup');
        Logger.log(`🔍 Verification: User ${updatedUser.email} now has role: ${(updatedUser.roleGroup as any)?.name}`);

    } catch (error) {
        Logger.error('❌ Error:', error.message);
    }

    await app.close();
}

bootstrap().catch(console.error);