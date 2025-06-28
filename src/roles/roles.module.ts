import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RoleGroup, RoleGroupSchema } from './rolegroup.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RoleGroup.name, schema: RoleGroupSchema },
        ]),
    ],
    providers: [
        {
            provide: 'RoleGroupModel',
            useFactory: (connection: Connection) =>
                connection.model('RoleGroup', RoleGroupSchema),
            inject: [getConnectionToken()],
        },
    ],
    exports: [
        MongooseModule,
        'RoleGroupModel',
    ],
})
export class RolesModule { }
