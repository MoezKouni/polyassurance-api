import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from 'src/models/permission.model';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>){}

  async create(createPermissionDto: CreatePermissionDto) {
    const perimission = await this.permissionModel.findOne({name: createPermissionDto.name})

    if(perimission){
      throw new HttpException("Permission déjà existe", 400)
    }

    const createdPerimission = new this.permissionModel(createPermissionDto);
    return createdPerimission.save()
  }

  findAll() {
    return this.permissionModel.find().select("name _id")
  }

  findOne(id: string) {
    return this.permissionModel.findById(id);
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionModel.findByIdAndUpdate(id, {...updatePermissionDto}, {new: true})
  }

  remove(id: string) {
    return this.permissionModel.findByIdAndDelete(id);
  }
}
