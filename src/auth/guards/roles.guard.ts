import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// entities
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user.roles.some((r) => r.includes(roles));
  }
}
