import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from '../permissions/permission.schema';
import { Model } from 'mongoose';

@Injectable()
export class PermissionSeederService {
    constructor(
        @InjectModel(Permission.name)
        private permissionModel: Model<Permission>,
    ) { }

    private readonly permissionList: string[] = [
        'login',
        'logout',
        'forgot_password',
        'user_list_view',
        'user_worklog_view',
        'worklog_create',
        'worklog_view_own',
        'project_create',
        'project_view',
        'rolegroup_read',
        'dashboard_view',
        'permission_check',
    ];

    async run() {
        for (const name of this.permissionList) {
            const exists = await this.permissionModel.findOne({ name });
            if (!exists) {
                await this.permissionModel.create({ name });
                Logger.log(`✅ Created permission: ${name}`);
            } else {
                Logger.log(`✅ Already exists: ${name}`);
            }
        }
    }
}
