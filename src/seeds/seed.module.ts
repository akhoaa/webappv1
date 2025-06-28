import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSeederService } from './permission-seeder.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { Permission, PermissionSchema } from '../permissions/permission.schema';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://pdanhkhoa2509:DcaPeEpYtGgQW9vn@cluster0.q1qzjnv.mongodb.net/auth_project'), // <== Kết nối thật ở đây hoặc dùng .env
        MongooseModule.forFeature([
            { name: Permission.name, schema: PermissionSchema },
        ]),
        PermissionsModule,
    ],
    providers: [PermissionSeederService],
})
export class SeedModule { }
