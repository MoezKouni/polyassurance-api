import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token =
      request.headers.authorization &&
      request.headers.authorization.split('Bearer ')[1];
    if (token) {
      const decoded: any = this.jwtService.decode(token);
      // const user = await this.userModel.findById(decoded.sub);
      const user = await this.userModel.findById(decoded.sub);
      if (user) {
        return roles.includes(decoded.role);
      }
    }
    return false;
  }
}
