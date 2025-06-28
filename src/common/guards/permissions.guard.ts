import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// Update the import path below if the actual location is different
import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true; // No permissions required
        }

        console.log('🔍 Required permissions:', requiredPermissions);

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            console.log('❌ No user found in request');
            throw new ForbiddenException('User not authenticated');
        }

        console.log('🔍 User object:', { userId: user.userId, email: user.email });

        try {
            // Fetch user with populated role group and permissions
            const fullUser = await this.usersService.findByIdWithRole(user.userId);

            if (!fullUser) {
                console.log('❌ User not found in database');
                throw new ForbiddenException('User not found');
            }

            if (!fullUser.roleGroup) {
                console.log('❌ User has no role group assigned');
                throw new ForbiddenException('User has no role assigned');
            }

            // Extract permission names from the role group
            const userPermissions = fullUser.roleGroup.permissions.map(permission =>
                typeof permission === 'string' ? permission : permission.name
            );

            console.log('🔍 User permissions:', userPermissions);

            // Check if user has all required permissions
            const missingPermissions = requiredPermissions.filter(
                permission => !userPermissions.includes(permission)
            );

            if (missingPermissions.length > 0) {
                console.log('❌ Permission denied. Missing permissions:', missingPermissions);
                throw new ForbiddenException(`Missing permissions: ${missingPermissions.join(', ')}`);
            }

            console.log('✅ Permission check passed');
            return true;

        } catch (error) {
            console.log('❌ Error during permission check:', error.message);
            throw new ForbiddenException('Permission check failed');
        }
    }
}
