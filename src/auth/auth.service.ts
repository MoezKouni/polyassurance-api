import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/models/user.model';
import { UsersService } from 'src/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(email, pass) {
    // check if email is registered in the database
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      // check if password matchs the password saved in the database
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new HttpException('Vérifier votre mot de passe', 401);
      }
    }
    return null;
  }

  // Login User with email
  async login(user: any) {
    // generate jwt
    if (user.archived) {
      throw new HttpException('Votre compte est archivé', 401);
    }
    const payload = { username: user.username, sub: user._id, role: user.role };
    await this.userModel.findByIdAndUpdate(user._id, {
      last_login: new Date(),
    });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Register user with email
  async register(createUserDto: CreateUserDto): Promise<User | any> {
    // check if email is already registered
    const emailExists = await this.usersService.findUserByEmail(
      createUserDto.email,
    );

    if (emailExists) {
      throw new HttpException(
        'email:Adresse email déjà utilisée,msg:Adresse e-mail est déjà utilisée',
        400,
      );
    }

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // save user in the database
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await createdUser.save();
    return this.login(createdUser);
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
