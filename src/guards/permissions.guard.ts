import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<any[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token =
      request.headers.authorization &&
      request.headers.authorization.split('Bearer ')[1];
    if (token) {
      const decoded: any = this.jwtService.decode(token);
      const admin: any = await this.userModel
        .findById(decoded.sub)
        .populate('permissions', 'name -_id');
      if (admin.role === 'admin') {
        return true;
      }
      const authorized = admin.permissions.find(
        (el: any) => el.name === permissions[0],
      );
      if (authorized) {
        return true;
      } else {
        throw new ForbiddenException(
          "vous n'êtes pas autorisé a voir cette page / à exécuter cette action",
        );
      }
    }
  }
}
