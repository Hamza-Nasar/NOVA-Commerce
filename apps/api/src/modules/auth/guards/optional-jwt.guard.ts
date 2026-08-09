import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(error: Error | null, user: TUser | false) {
    if (error || !user) return null;
    return user;
  }
  canActivate(context: ExecutionContext) { return super.canActivate(context); }
}
