import { AUTH_SERVICE } from '@app/gobal';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, of, switchMap } from 'rxjs';

export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authProxy: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request?.headers['authorization']; // 'bearer token'

    if (!authHeader) throw new UnauthorizedException();

    const authPath = authHeader.split(' '); // ['bearer', 'token']

    if (authPath.length !== 2) return false;

    const [, jwt] = authPath;

    return this.authProxy.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
      switchMap(({ exp }) => {
        if (!exp) return of(false);

        const TOKEN_EXP_MS = +exp * 1000; // exp is second => conver to millisecond

        const isJwtValid = TOKEN_EXP_MS > Date.now();

        return of(isJwtValid);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );
  }
}
