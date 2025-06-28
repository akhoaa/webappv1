import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './permission.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Permission.name, schema: PermissionSchema },
        ]),
    ],
    exports: [MongooseModule], // ❗ xuất MongooseModule là đủ
})
export class PermissionsModule { }


