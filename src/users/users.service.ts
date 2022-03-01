import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUserById(id: string): Promise<User> {
    return this.userModel.findById(id).select('-password -__v');
  }

  findTeammembers() {
    return this.userModel.find({ role: { $in: ['admin', 'agent'] } });
  }

  async createNewMember(data: CreateUserDto) {
    const member = await this.userModel.findOne({ email: data.email });

    if (member) {
      throw new HttpException('Adresse email déjà utilisée', 400);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newMember = new this.userModel({ ...data, password: hashedPassword });

    await newMember.save();
    return 'success';
  }

  getOneTeammember(id: string) {
    return this.userModel.findById(id).populate('permissions');
  }

  async updateTeammember(id: string, updateUserDto: UpdateUserDto) {
    const admin = await this.userModel.findById(id);

    if (!admin) {
      throw new HttpException('Membre Introuvable', 404);
    }

    let hashedPassword = '';
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
    }
    const updatedAdmin = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, password: hashedPassword || admin.password },
      { new: true },
    );

    if (!updatedAdmin) {
      throw new HttpException('Server Error', 500);
    }

    return {
      status: 'success',
    };
  }

  findAllClients() {
    return this.userModel.find({ role: 'client' });
  }

  async archiveMember(id: string) {
    const admin = await this.userModel.findById(id);

    if (!admin) {
      throw new HttpException('Administrateur introuvable', 404);
    }

    admin.archived = !admin.archived;
    await admin.save();

    return admin;
  }

  findOneClient(id: string) {
    return this.userModel.findById(id);
  }

  async createNewClient(data: CreateUserDto) {
    const client = await this.userModel.findOne({ email: data.email });

    if (client) {
      throw new HttpException('Adresse email déjà utilisée', 400);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newclient = new this.userModel({ ...data, password: hashedPassword });

    await newclient.save();
    return 'success';
  }

  async updateClient(id: string, updateUserDto: UpdateUserDto) {
    const admin = await this.userModel.findById(id);

    if (!admin) {
      throw new HttpException('Client Introuvable', 404);
    }

    let hashedPassword = '';
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
    }
    const updatedAdmin = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, password: hashedPassword || admin.password },
      { new: true },
    );

    if (!updatedAdmin) {
      throw new HttpException('Server Error', 500);
    }

    return {
      status: 'success',
    };
  }

  async findRecentSingups(){
    const clients = await this.userModel.find({role: "client"}).sort({createdAt: -1}).limit(5)
    return clients
  }
}
