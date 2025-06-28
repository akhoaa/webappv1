// src/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleGroup, RoleGroupSchema } from './rolegroup.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RoleGroup.name, schema: RoleGroupSchema },
        ]),
    ],
    exports: [MongooseModule], // This exports the MongooseModule with RoleGroup model
})
export class RolesModule { }