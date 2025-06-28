import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true; // Route không yêu cầu quyền nào cụ thể
        }

        const { user } = context.switchToHttp().getRequest();

        const userPermissions = user?.permissions || [];

        const hasPermission = requiredPermissions.every(p =>
            userPermissions.includes(p),
        );

        if (!hasPermission) {
            throw new ForbiddenException('You do not have required permissions');
        }

        return true;
    }
}
