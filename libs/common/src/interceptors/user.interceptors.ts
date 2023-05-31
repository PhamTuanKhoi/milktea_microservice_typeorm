import { AUTH_SERVICE } from '@app/gobal';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, switchMap } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(@Inject(AUTH_SERVICE) private readonly authProxy: ClientProxy) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) return next.handle();

    const authPath = authHeader.split(' '); // ['bearer', 'token']

    if (authPath.length !== 2) return next.handle();

    const [, jwt] = authPath;

    return this.authProxy.send({ cmd: 'decode-jwt' }, { jwt }).pipe(
      switchMap(({ user }) => {
        request.user = user;

        request.body.userId = user.id;

        return next.handle();
      }),
      catchError(() => next.handle()),
    );
  }
}
