import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser>(error: Error | null, user: TUser | false) {
    if (error || !user) {
      throw error ?? new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
