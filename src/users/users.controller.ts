import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @Permissions('user_list_view')
    getAllUsers() {
        return this.usersService.findAll(); // hoặc trả dữ liệu thật
    }

    @Patch(':id/role')
    @Permissions('rolegroup_read')
    async assignRoleGroup(
        @Param('id') userId: string,
        @Body('roleGroupId') roleGroupId: string,
    ) {
        return this.usersService.assignRoleGroup(userId, roleGroupId);
    }
}
