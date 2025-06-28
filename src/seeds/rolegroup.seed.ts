// src/seeds/rolegroup.seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RoleGroup } from '../roles/rolegroup.schema';
import { Permission } from '../permissions/permission.schema';

const roleGroups = [
    {
        name: 'Owner',
        permissions: [
            'login',
            'logout',
            'user_list_view',
            'project_view',
            'rolegroup_read',
            'dashboard_view',
            'permission_check',
        ],
    },
    {
        name: 'Staff',
        permissions: ['login', 'logout', 'worklog_create', 'worklog_view_own'],
    },
];

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    // 🔥 FIX: Use getModelToken instead of string injection
    const roleGroupModel = app.get<Model<RoleGroup>>(getModelToken(RoleGroup.name));
    const permissionModel = app.get<Model<Permission>>(getModelToken(Permission.name));

    for (const role of roleGroups) {
        const exists = await roleGroupModel.findOne({ name: role.name });
        if (exists) {
            Logger.log(`⚠️ Already exists: ${role.name}`);
            continue;
        }

        const perms = await permissionModel.find({
            name: { $in: role.permissions },
        });

        Logger.log(`📋 Found ${perms.length} permissions for ${role.name}:`, perms.map(p => p.name));

        const created = await roleGroupModel.create({
            name: role.name,
            permissions: perms.map((p) => p._id),
        });

        Logger.log(`✅ Created RoleGroup: ${created.name} with ${perms.length} permissions`);
    }

    await app.close();
}

bootstrap().catch(console.error);