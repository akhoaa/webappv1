import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { RoleGroup } from '../roles/rolegroup.schema';
import { Model } from 'mongoose';

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

    const roleGroupModel = app.get<Model<RoleGroup>>('RoleGroupModel');
    const permissionModel = app.get<Model<any>>('PermissionModel');

    for (const role of roleGroups) {
        const exists = await roleGroupModel.findOne({ name: role.name });
        if (exists) {
            Logger.log(`⚠️ Already exists: ${role.name}`);
            continue;
        }

        const perms = await permissionModel.find({
            name: { $in: role.permissions },
        });

        const created = await roleGroupModel.create({
            name: role.name,
            permissions: perms.map((p) => p._id),
        });

        Logger.log(`✅ Created RoleGroup: ${created.name}`);
    }

    await app.close();
}
